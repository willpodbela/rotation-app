require 'subscribe_user_to_premium'
 
class SubscriptionsController < ApplicationController
  def new
 
    #Always store your API key in environment variables
    Stripe.api_key = Rails.configuration.stripe[:secret_key]
    @plan = Stripe::Plan.retrieve(stripe_plan_id)
  end
 
  def create
    Stripe.api_key = Rails.configuration.stripe[:secret_key]
        
    customer = Stripe::Customer.create(
      :email => params[:stripeEmail],
      :source  => params[:stripeToken]
    )
      
    stripe_subscription = customer.subscriptions.create({plan: stripe_plan_id})
    response = ServiceResponse.new(stripe_subscription)
    
    if response.success?
      flash[:notice] = 'You have successfully subscribed to our premium plan!'
    else
      flash[:alert] = 'Ooops, something went wrong!'
    end
 
    redirect_to root_path
  end
 
  private
 
    def subscription_params
      params.permit(:stripeToken, :stripeTokenType, :stripeEmail)
    end
    
    def stripe_plan_id
      "plan_DmpGqUGCX1SpsS"
    end
 
end