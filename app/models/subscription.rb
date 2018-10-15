class Subscription < ApplicationRecord
  belongs_to :user
  
  attr_accessor :subscription_params
  
  enum status: [ :inactive, :active, :payment_failed ]
  
  before_create do
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
    
    stripe_subscription = customer.subscriptions.create({plan: stripe_plan_id})
    print "STRIPE SUBSCRIPTION:\n"
    print stripe_subscription
    print "\n\n"
    response = ServiceResponse.new(stripe_subscription)
    if response.success?
      self.stripe_subscription_id = stripe_subscription.id
      self.status = :active
      #NOTE: We take an optimistic approach to payment processing, 
      #and activate the subscription unless we get a callback that payment failed
    else
      throw :abort
    end
  end
end
