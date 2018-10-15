require 'json'
 
module Api
  class StripeWebhookController < ApplicationController
    protect_from_forgery with: :null_session
    skip_before_action :authenticate_user!
  
    def stripe
      response = JSON.parse(request.body.read)
      data_object = response["data"]["object"]
      
      print "WEBHOOK CALLED: "+response["type"]
            
      case response["type"]
      # when "customer.created"
        # Occurs whenever a new customer is created.
        # No action: We're handling this synchronously right now
      # when "customer.subscription.created"
        # Occurs whenever a customer is signed up for a new plan.
        # No action: We're handling this synchronously right now
      when "customer.subscription.deleted"
        # Occurs whenever a customer's subscription ends.
        subscription_id = data_object["id"]
        subscription = Subscription.find_by_stripe_subscription_id(subscription_id)
        if subscription
          subscription.status = :canceled
          #subscription.stripe_subscription_obj = OpenStruct.new(data_object)
          subscription.save
        else
          # Log error
        end
      when "invoice.payment_succeeded"
        # Occurs whenever an invoice payment attempt succeeds.
        subscription_id = data_object["subscription"]
        subscription = Subscription.find_by_stripe_subscription_id(subscription_id)
        if subscription
          subscription.billing_status = :paid
          #subscription.stripe_subscription_obj = OpenStruct.new(data_object)
          subscription.save
        else
          # Log error
        end
      when "invoice.payment_failed"
        # Occurs whenever an invoice payment attempt fails, due either to a declined payment or to the lack of a stored payment method.
        subscription_id = data_object["subscription"]
        subscription = Subscription.find_by_stripe_subscription_id(subscription_id)
        if subscription
          subscription.billing_status = :payment_failed
          #subscription.stripe_subscription_obj = OpenStruct.new(data_object)
          subscription.save
        else
          # Log error
        end
      end
      
      return head :ok
    end
  end
end