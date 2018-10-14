require 'json'
 
module Api
  class StripeWebhookController < ApplicationController
    protect_from_forgery with: :null_session
    skip_before_action :authenticate_user!
  
    def stripe
      response = JSON.parse(request.body.read)
      data_object = response["object"]
    
      case response["type"]
      when "customer.subscription.created"
      
      when "invoice.payment_succeeded"
      
      when "invoice.payment_failed"
      
      end
      
      return head :ok
    end
  end
end