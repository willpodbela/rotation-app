require 'stripe'

class SubscriptionsService
  class << self
    # Checks if user has an active subscription. Returns boolean value
    def subscription_valid?(user, plan_id=stripe_plan_id)
      #Method Stub: TODO
    end
  
    # Processes the purchase of a subscription for user
    def purchase_subscription(user, subscription_params, plan_id=stripe_plan_id)
      begin
        Stripe.api_key = Rails.configuration.stripe[:secret_key]
    
        if user.stripe_customer_id? 
          customer = Stripe::Customer.retrieve(user.stripe_customer_id)
        else
          customer = Stripe::Customer.create(
            :email => params[:stripeEmail],
            :source  => params[:stripeToken]
          )
          user.stripe_customer_id = customer.id
          unless user.save
            # TODO: Log error
          end
        end
      
        stripe_subscription = customer.subscriptions.create({plan: plan_id})
        ServiceResponse.new(stripe_subscription)
      rescue Exception => e
        ServiceResponse.new(nil, false, e.to_s)
      end
    end
  
    # Cancel a user's subscription (at end of billing period)
    def cancel_subscription(user, plan_id=stripe_plan_id)
      #Method Stub: TODO
    end
  
    def stripe_plan_id
      "plan_DmpGqUGCX1SpsS"
    end
  end
end