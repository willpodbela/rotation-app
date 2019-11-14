 class SubscriptionsController < ApplicationController
  
  def create
    begin
      subscription = StripeService.create_monthly_subscription(current_user, subscription_params[:stripeToken])
      
      if subscription.payment_action_required?
        flash[:alert] = 'Your Bank requires a bit more verification, please complete final step below'
      else
        flash[:notice] = 'You have successfully subscribed to our premium plan!'
      end
    rescue Stripe::CardError => e
      # CardError; return the error message.
      flash[:alert] = e.message
    rescue => e
      # Some other error
      flash[:alert] = 'Ooops, something went wrong!'
    end
    
    redirect_to status_path
  end
  
  def update_payment
    begin
      subscription = current_user.current_subscription
      if subscription.incomplete?
        subscription = StripeService.change_payment_and_reattempt_monthly_subscription(current_user, subscription_params[:stripeToken])
        if subscription.payment_action_required?
          flash[:alert] = 'Your Bank requires a bit more verification, please complete final step below'
        else
          flash[:notice] = 'You have successfully subscribed to our premium plan!'
        end
      else
        StripeService.update_or_create_customer_with_payment(current_user, subscription_params[:stripeToken])
        flash[:notice] = 'You have successfully updated your card on file.'
      end
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
    begin
      StripeService.cancel_monthly_subscription(current_user)
      
      flash[:notice] = 'You have successfully cancelled your plan. Please allow up to 24hrs for processing.'
    rescue StripeService::StripeServiceError => e
      # StripeServiceError = Something happened in control logic of StripeService class that shouldn't have; return the error message.
      flash[:alert] = e.message
    rescue => e
      flash[:alert] = 'Oops, something went wrong! Please email support@therotation.club for help. (Pinky swear this is not a ploy to make it hard to cancel. Something actually went wrong.)'
    end
    
    redirect_to status_path
  end
  
  def restore
    begin
      StripeService.uncancel_monthly_subscription(current_user)
      
      flash[:notice] = 'You have successfully restored your plan. Glad to you have you back! Please allow up to 24hrs for processing.'
    rescue StripeService::StripeServiceError => e
      # StripeServiceError = Something happened in control logic of StripeService class that shouldn't have; return the error message.
      flash[:alert] = e.message
    rescue => e
      flash[:alert] = 'Oops, something went wrong! Please email support@therotation.club for help.'
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