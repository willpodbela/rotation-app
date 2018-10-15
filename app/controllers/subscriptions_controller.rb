 class SubscriptionsController < ApplicationController
  
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
    
    print "AHHHHHH: \n\n"
    print stripe_subscription_obj
    
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
      
      if session[:ios_init]
        session[:ios_init] = false
        redirect_to ios_deep_link_path
      else 
        redirect_to status_path
      end
    else
      flash[:alert] = 'Ooops, something went wrong!'
      redirect_to status_path
    end
  end
  
  def cancel
    loc_subscription = current_user.subscriptions.current.active.first
    if loc_subscription
      subscription = Stripe::Subscription.retrieve(loc_subscription.stripe_subscription_id)
      subscription.cancel_at_period_end = true
      if subscription.save
        flash[:notice] = 'You have successfully cancelled your plan. Please allow up to 24hrs for processing.'
      else 
        flash[:alert] = 'Ooops, something went wrong!'
      end
    end
    
    redirect_to status_path
  end
  
  def restore
    loc_subscription = current_user.subscriptions.current.canceled.first
    if loc_subscription
      subscription = Stripe::Subscription.retrieve(loc_subscription.stripe_subscription_id)
      subscription.cancel_at_period_end = false
      if subscription.save
        flash[:notice] = 'You have successfully restored your plan. Glad to you have you back! Please allow up to 24hrs for processing.'
      else 
        flash[:alert] = 'Ooops, something went wrong!'
      end
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
 
    def ios_deep_link_path
      "rotation://success"
    end
end