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
      
      def update
        begin
          subscription = StripeService.update_subscription(current_user, subscription_params)
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
        render_error(400, "We're out of Beta! Please update to the latest version in the App Store to sign-up.")
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
          render_error(500, nil)
        end
      end
 
      private
 
      def stripe_plan_id
        ENV['STRIPE_PLAN_ID']
      end
 
      def subscription_params
        params.permit(:stripe_source_id, :cancel_at_period_end)
      end
      
      def set_resource(resource = nil)
        resource ||= current_user.current_subscription
      
        # Set instance variables for use in the global view template (fallback if no :show template is provided)
        instance_variable_set("@global_view_template_data", resource)
        instance_variable_set("@global_view_template_name", resource_name)
        
        instance_variable_set("@#{resource_name}", resource)
      end
      
    end
  end
end