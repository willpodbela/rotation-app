class StripeService
  class << self
  
    def create_monthly_subscription(user, stripe_source_id)
      raise ArgumentError.new("Missing STRIPE_PLAN_ID") unless ENV.has_key?('STRIPE_PLAN_ID')
      
      Stripe.api_key = Rails.configuration.stripe[:secret_key]
      
      # Set customer (retrive or create)
      if user.stripe_customer_id? 
        customer = Stripe::Customer.retrieve(user.stripe_customer_id)
      else
        customer = Stripe::Customer.create(
          :email => user.email,
          :source  => stripe_source_id
        )
        user.stripe_customer_id = customer.id
        unless user.save
          # TODO: Log error - stripe succeeded but local obj could not be saved          
        end
      end
      
      # Create subscription
      params = {plan: ENV['STRIPE_PLAN_ID']}
      if coupon = user.coupon
        params[:coupon] = coupon.id
      end
            
      stripe_subscription_obj = customer.subscriptions.create(params)
      response = ServiceResponse.new(stripe_subscription_obj)
      if response.success?
        subsciption = Subscription.new(
          :user => user,
          :stripe_subscription_obj => stripe_subscription_obj,
          :stripe_plan_id => ENV['STRIPE_PLAN_ID']
        )
        unless subsciption.save
          # TODO: Log error - stripe succeeded but local obj could not be saved
        end
        
        user.update(has_used_promo: true) unless coupon.nil?
        
        return subsciption
      else
        # TODO: Log error from stripe
        raise StandardError.new("Unable to create subscription in Stripe")
      end
    end
    
    def get_coupon(code)    
      Stripe.api_key = Rails.configuration.stripe[:secret_key]
      begin
        coupon = Stripe::Coupon.retrieve(code.id)
        
        #Someone made the Coupon in the Stripe Web UI, thats cool but lets just note it on the model
        unless code.has_stripe_coupon?
          code.has_stripe_coupon = true
          code.save
        end
        return coupon
      rescue Stripe::InvalidRequestError => e
        if e.http_status == 404 && code.has_stripe_coupon?
          code.has_stripe_coupon = false
          code.save
        end
        
        return nil
      end
    end
  
    def create_coupon(code, params)   
      print(params)
             
      Stripe.api_key = Rails.configuration.stripe[:secret_key]
      params[:id] = code.id
      coupon = Stripe::Coupon.create(params)
      
      code.has_stripe_coupon = true
      code.save
      
      return coupon
    end
    
  end
end