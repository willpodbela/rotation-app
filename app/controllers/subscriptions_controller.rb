require 'subscriptions_service'
 
class SubscriptionsController < ApplicationController
  def new
 
    #Always store your API key in environment variables
    Stripe.api_key = Rails.configuration.stripe[:secret_key]
    @plan = Stripe::Plan.retrieve(stripe_plan_id)
  end
 
  def create
    subsciption = Subscription.new(
      :user => current_user,
      :subscription_params => subscription_params,
      :stripe_plan_id => stripe_plan_id
    )
    
    if subsciption.save
      flash[:notice] = 'You have successfully subscribed to our premium plan!'
    else
      flash[:alert] = 'Ooops, something went wrong!'
    end
    
    redirect_to status_path
  end
 
  private
 
    def subscription_params
      params.permit(:stripeToken, :stripeTokenType, :stripeEmail)
    end
    
    def stripe_plan_id
      "plan_DmpGqUGCX1SpsS"
    end
 
end