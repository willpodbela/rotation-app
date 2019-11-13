module Api
    module V1
    class SubscriptionsController < Api::V1::BaseController
      
      #Failsafe: Override endpoints that we don't want to make available
      def destroy
        render_error(405)
      end
      def index
        render_error(405)
      end
      def show
        render_error(405)
      end
      
      # Only param that can be passed right now is :cancel_at_period_end
      # (in the future we can also use this endpoint to change tiers)
      def update
        begin
          subscription = StripeService.set_subscription_cancel_at_period_end(current_user, subscription_params[:cancel_at_period_end])
          set_resource(subscription)
          render :show, status: :created
        rescue Stripe::CardError, StripeService::StripeServiceError => e
          # CardError = Invalid card; return the error message.
          # StripeServiceError = Something happened in control logic of StripeService class that shouldn't have; return the error message.
          render_error(400, e.message)
        rescue => e
          # Some other error; Return 500
          # TODO: Log
          render_error(500, nil)
        end
      end
      
      def create                
        begin
          subscription = StripeService.create_monthly_subscription(current_user, subscription_params[:stripe_source_id])
          set_resource(subscription)
          render :show, status: :created
        rescue Stripe::CardError => e
          # CardError; return the error message.
          render_error(400, e.message)
        rescue => e
          # Some other error; Return 500
          # TODO: Log
          render_error(500, nil)
        end
      end
 
      def update_payment
        begin
          if !current_user.current_subscription.incomplete? && current_user.current_subscription.paid?
            StripeService.update_or_create_customer_with_payment(current_user, subscription_params[:stripe_source_id])
            subscription = current_user.current_subscription
          else
            subscription = StripeService.change_payment_and_reattempt_monthly_subscription(current_user, subscription_params[:stripe_source_id])
          end
          
          set_resource(subscription)
          render :show, status: :ok
        rescue Stripe::CardError, StripeService::StripeServiceError => e
          # CardError = Invalid card; return the error message.
          # StripeServiceError = Something happened in control logic of StripeService class that shouldn't have; return the error message.
          render_error(400, e.message)
        rescue => e
          # Some other error; Return 500
          # TODO: Log
          render_error(500, e.message)
        end
      end
 
      private
 
      def subscription_params
        params.permit(:stripe_source_id, :cancel_at_period_end)
      end
      
    end
  end
end