 class SubscriptionsController < ApplicationController
  
  def create
    begin
      StripeService.create_monthly_subscription(current_user, subscription_params[:stripeToken])

      flash[:notice] = 'You have successfully subscribed to our premium plan!'
    rescue Stripe::CardError => e
      # CardError; return the error message.
      flash[:alert] = e.message
    rescue => e
      # Some other error
      flash[:alert] = 'Ooops, something went wrong!'
    end
    
    redirect_to status_path
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
      ENV['STRIPE_PLAN_ID']
    end
end