require 'stripe'

class SubscribeUserToPremium

  def call(user, subscription_params, plan_id)
    begin

      #Always store your API key in environment variables
      Stripe.api_key = Rails.configuration.stripe[:secret_key]

      customer = Stripe::Customer.create(
        :email => params[:stripeEmail],
        :source  => params[:stripeToken]
      )
      
      stripe_subscription = customer.subscriptions.create({plan: plan_id})
      
      ServiceResponse.new(stripe_subscription)

    rescue Exception => e
      ServiceResponse.new(nil, false, 'Something went wrong!')
    end
  end
  
end