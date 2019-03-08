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
      reraise_exception = nil
        
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
  
    def create_coupon(code, params)   
      Stripe.api_key = Rails.configuration.stripe[:secret_key]
      params[:id] = code.id
      coupon = Stripe::Coupon.create(params)
      
      code.has_stripe_coupon = true
      code.save
    
      return coupon
    end
    
  end
end