class StripeService
  class StripeServiceError < StandardError; end
  
  class << self
  
    # Returns a Stripe::Customer Object
    def update_or_create_customer_with_payment(user, stripe_source_id)
      setup
    
      if user.stripe_customer_id? 
        customer = Stripe::Customer.update(user.stripe_customer_id, {
          source: stripe_source_id
        })
        return customer
      else
        customer = Stripe::Customer.create(
          :email => user.email,
          :source  => stripe_source_id
        )
        user.stripe_customer_id = customer.id
        unless user.save
          # TODO: Log error - stripe succeeded but local obj could not be saved          
        end
        return customer
      end
    end
    
    # Returns a Stripe::Customer Object
    def retrive_or_create_customer(user)
      setup
      
      if user.stripe_customer_id? 
        return Stripe::Customer.retrieve(user.stripe_customer_id)
      else
        customer = Stripe::Customer.create({
          email: user.email
        })
        user.stripe_customer_id = customer.id
        unless user.save
          # TODO: Log error - stripe succeeded but local obj could not be saved          
        end
        return customer
      end
    end
    
    # Returns a (Rotation Application) Subscription Object
    def create_monthly_subscription(user, stripe_source_id, item_qty)
      # Check and format arguments
      plan_qty = item_qty.to_i
      raise ArgumentError.new("Missing STRIPE_PLAN_ID") unless ENV.has_key?('STRIPE_PLAN_ID')
      raise ArgumentError.new("Missing item qty / tier selection") if plan_qty.nil?
      # Currently we only want to allow plans between 2 and 4, while this is also enforced in the view, we double check for safety here.
      # NOTE: This logic may need to be removed / changed if user.available_tiers (in user.rb) is changed
      raise ArgumentError.new("Invalid item qty / tier selection for plan") if plan_qty > 4 || plan_qty < 2
      # Block from accidental double creation of subscriptions
      loc_subscription = user.current_subscription
      unless loc_subscription.nil?
        raise StripeServiceError.new("User already has active subscription. Go to account page to cancel, restore, or change tiers.") if (loc_subscription.active? || loc_subscription.canceled?)
      end
      
      # Common Setup
      setup
      
      # Retrive or create Customer and attach payment method
      customer = update_or_create_customer_with_payment(user, stripe_source_id)
      
      # Call Stripe to create Subscription
      params = {plan: ENV['STRIPE_PLAN_ID'], quantity: plan_qty, payment_behavior: "allow_incomplete"}
      if coupon = user.coupon
        params[:coupon] = coupon.id
      end
      stripe_subscription_obj = customer.subscriptions.create(params)
      
      # Handle Responce
      response = ServiceResponse.new(stripe_subscription_obj)
      if response.success?
        subscription = Subscription.new(
          :user => user,
          :stripe_subscription_obj => stripe_subscription_obj,
          :stripe_plan_id => ENV['STRIPE_PLAN_ID'],
          :item_qty => plan_qty
        )
        
        if subscription.incomplete?
          payment_intent = get_payment_intent(stripe_subscription_obj.latest_invoice)
          
          case payment_intent[:status]
          when "requires_payment_method", "requires_source"
            subscription.billing_status = :payment_failed
          when "requires_action", "requires_source_action"
            subscription.billing_status = :payment_action_required
            subscription.incomplete_payment_intent_client_secret = payment_intent[:client_secret]
          else
            # TODO: Log error - an incomplete subscription should only have a payment_intent status of those listed above
          end
        end
        
        unless subscription.save
          # TODO: Log error - stripe succeeded but local obj could not be saved
        end
        
        user.update(has_used_promo: true) unless coupon.nil?
        
        return subscription
      else
        # TODO: Log error from stripe
        raise StripeServiceError.new("Unable to create subscription in Stripe")
      end
    end
    
    # Returns a (Rotation Application) Subscription Object
    def change_payment_and_reattempt_monthly_subscription(user, stripe_source_id)
      setup
      
      loc_subscription = user.subscriptions.current.valid.first
      if loc_subscription
        # Retrive or create Customer and attach payment method
        customer = update_or_create_customer_with_payment(user, stripe_source_id)
        
        # Ensure we have the lastest_invoice_id
        if loc_subscription.latest_invoice_id.nil?
          refresh_subscription_data(loc_subscription, true)
          if loc_subscription.latest_invoice_id.nil?
            raise StripeServiceError.new("Fatal internal error occured. Please contact support@therotation.club.")
          end
        end
        
        if loc_subscription.incomplete?
          begin
            # Reattempt (and get) subscription invoice
            payment_intent = reattempt_invoice(loc_subscription.latest_invoice_id)  
          rescue => e
            # Silence all errors as the above call with throw a 402 if :payment_action_required
            # ^ Stripe trash
          end        
        end
        
        # Get subscription invoice
        payment_intent = get_payment_intent(loc_subscription.latest_invoice_id)
        
        case payment_intent[:status]
        when "succeeded"
          refresh_subscription_data(loc_subscription)
          unless loc_subscription.save
             # TODO: Log error - stripe succeeded but local obj could not be saved
          end
          return loc_subscription
        when "requires_payment_method", "requires_source"
          loc_subscription.billing_status = :payment_failed
          unless loc_subscription.save
             # TODO: Log error - stripe succeeded but local obj could not be saved
          end
          raise StripeServiceError.new("Payment failed. Please use a different payment method.")
        when "requires_action", "requires_source_action"
          refresh_subscription_data(loc_subscription)
          loc_subscription.billing_status = :payment_action_required
          loc_subscription.incomplete_payment_intent_client_secret = payment_intent[:client_secret]
          unless loc_subscription.save
             # TODO: Log error - stripe succeeded but local obj could not be saved
          end
          return loc_subscription
        end
      else
        raise StripeServiceError.new("Customer does not have a subscription elidgable for re-attampt. Please contact support@therotation.club.")
      end
    end
    
    # Returns a (Rotation Application) Subscription Object
    def update_subscription(user, params)
      setup
      
      loc_subscription = user.subscriptions.current.valid.first
      if loc_subscription
        subscription = Stripe::Subscription.retrieve(loc_subscription.stripe_subscription_id)
        subscription.cancel_at_period_end = params[:cancel_at_period_end] if params.key?(:cancel_at_period_end)
        if params.key?(:item_qty)
          subscription.quantity = params[:item_qty]
          loc_subscription.item_qty = params[:item_qty]
        end
        if subscription.save
          loc_subscription.stripe_subscription_obj = subscription
          unless loc_subscription.save
             # TODO: Log error - stripe succeeded but local obj could not be saved
          end
          
          return loc_subscription
        else 
          raise StripeServiceError.new("Unable to update subscription in Stripe. Please contact support@therotation.club.")
        end
      else
        raise StripeServiceError.new("Customer does not have a subscription elidgable for re-activation or tier change. Please contact support@therotation.club.")
      end
    end
    
    # Returns a Stripe::Coupon object
    def get_coupon(code)
      setup
      
      reraise_exception = nil
        
      begin      
        coupon = Stripe::Coupon.retrieve(code.id)
        
        #Someone made the Coupon in the Stripe Web UI, thats cool but lets just note it on the model
        unless code.has_stripe_coupon?
          code.has_stripe_coupon = true
          code.save
        end
        return coupon
      rescue Stripe::InvalidRequestError => e
        # If 404 does not exist, handle error, else re-raise error
        if e.http_status == 404
          code.update(has_stripe_coupon: false) if code.has_stripe_coupon?
          return nil
        else
          reraise_exception = e
        end
      end
      
      raise e if reraise_exception.is_a? Stripe::InvalidRequestError
    end
  
    # Returns a Stripe::Coupon object
    def create_coupon(code, params)   
      setup
      
      params[:id] = code.id
      coupon = Stripe::Coupon.create(params)
      
      code.has_stripe_coupon = true
      code.save
    
      return coupon
    end
    
    # Given a Stripe::Invoice.id, Returns a Stripe::PaymentIntent object
    def get_payment_intent(invoice_id)      
      setup
      
      invoice = Stripe::Invoice.retrieve(invoice_id)
      unless invoice[:payment_intent].nil?
        return Stripe::PaymentIntent.retrieve(invoice[:payment_intent])
      else
        return nil
      end
    end
    
    # Given a Stripe::Invoice.id, Returns a Stripe::PaymentIntent object
    def reattempt_invoice(invoice_id)
      setup
      
      invoice = Stripe::Invoice.pay(invoice_id, {
        expand: ['payment_intent']
      })
      unless invoice[:payment_intent].nil?
        return Stripe::PaymentIntent.retrieve(invoice[:payment_intent][:id])
      else
        return nil
      end
    end
    
    # Retrieves Stripe::Subscription from Stripe server and loads attributes into corresponding (Rotation Application) Subscription Object 
    def refresh_subscription_data(subscription, should_save_after_refresh = false)
      setup
      
      subscription.stripe_subscription_obj = Stripe::Subscription.retrieve(subscription.stripe_subscription_id)
      subscription.save if should_save_after_refresh
      return subscription
    end
    
    # Returns Int value of customer balance from Stripe server. A negative number means the customer has a credit toward next statement. A postive number means they owe us money. 
    def get_customer_balance(user)
      setup
      
      if user.stripe_customer_id.nil?
        return 0
      else
        bal = Stripe::Customer.list_balance_transactions(user.stripe_customer_id, {
          limit: 1
        })
        if bal["data"].length > 0
          return bal["data"][0]["ending_balance"]
        else
          return 0
        end
      end
    end
    
    # Adds credit to the customer's account for amount in USD cents that will go toward next statement or purchase. Returns Int representing new customer balance.
    def create_account_credit(user, amount, description = nil)
      setup
      
      cust = retrive_or_create_customer(user)
      params = {amount: -amount, currency: 'usd'}
      unless description.nil?
        params[:description] = description
      end
      bal = Stripe::Customer.create_balance_transaction(user.stripe_customer_id, params)
      return bal["ending_balance"]
    end
      
    # Retrieves Stripe::Plan object from Stripe server so tiers and prices can be viewed
    def get_plan
      raise ArgumentError.new("Missing STRIPE_PLAN_ID") unless ENV.has_key?('STRIPE_PLAN_ID')
      setup
      return Stripe::Plan.retrieve(ENV['STRIPE_PLAN_ID'])
    end
    
    private
    
    # Call at start of every function
    def setup
      Stripe.api_key = Rails.configuration.stripe[:secret_key]
    end
     
  end
end