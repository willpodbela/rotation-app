 class SubscriptionsController < ApplicationController
  def new
 
    #Always store your API key in environment variables
    Stripe.api_key = Rails.configuration.stripe[:secret_key]
    @plan = Stripe::Plan.retrieve(stripe_plan_id)
  end
 
  def create
    Stripe.api_key = Rails.configuration.stripe[:secret_key]

    if current_user.stripe_customer_id? 
      customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)
    else
      customer = Stripe::Customer.create(
        :email => subscription_params[:stripeEmail],
        :source  => subscription_params[:stripeToken]
      )
      current_user.stripe_customer_id = customer.id
      unless current_user.save
        # TODO: Log error
      end
    end
    
    stripe_subscription_obj = customer.subscriptions.create({plan: stripe_plan_id})
    response = ServiceResponse.new(stripe_subscription_obj)
    if response.success?
      flash[:notice] = 'You have successfully subscribed to our premium plan!'
      subsciption = Subscription.new(
        :user => current_user,
        :stripe_subscription_obj => stripe_subscription_obj,
        :stripe_plan_id => stripe_plan_id
      )
      unless subsciption.save
        # Log this error.
      end
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