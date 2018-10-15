require 'json'
 
module Api
  class StripeWebhookController < ApplicationController
    protect_from_forgery with: :null_session
    skip_before_action :authenticate_user!
  
    def stripe
      response = JSON.parse(request.body.read)
      data_object = response["object"]
    
      case response["type"]
      when "customer.created"
        # Occurs whenever a new customer is created.
        # No action: We're handling this synchronously right now
      when "customer.subscription.created"
        # Occurs whenever a customer is signed up for a new plan.
        # No action: We're handling this synchronously right now
      when "customer.subscription.deleted"
        # Occurs whenever a customer's subscription ends.
        
      when "invoice.payment_succeeded"
        # Occurs whenever an invoice payment attempt succeeds.
        
      when "invoice.payment_failed"
        # Occurs whenever an invoice payment attempt fails, due either to a declined payment or to the lack of a stored payment method.
        
      end
      
      return head :ok
    end
  end
end