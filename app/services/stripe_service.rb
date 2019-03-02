class StripeService
  class << self
  
    def create_monthly_subscription(user, stripe_source_id)
      raise ArgumentError.new("Missing STRIPE_PLAN_ID") unless ENV.has_key?('STRIPE_PLAN_ID')
      
      Stripe.api_key = Rails.configuration.stripe[:secret_key]
      
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
        else
          
          # Happy path
          stripe_subscription_obj = customer.subscriptions.create({plan: ENV['STRIPE_PLAN_ID']})
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
          else
            # TODO: Log error from stripe
            raise StandardError.new("Unable to create subscription in Stripe")
          end
        end
      end
    end
    
  end
end