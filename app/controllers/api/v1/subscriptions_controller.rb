module Api
    module V1
    class SubscriptionsController < Api::V1::BaseController
      
      #Failsafe: Override endpoints that we don't want to make available
      def destroy
        render_error(405)
      end
      def update
        render_error(405)
      end
      def index
        render_error(405)
      end
      def show
        render_error(405)
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
 
      private
 
      def subscription_params
        params.permit(:stripe_source_id)
      end
      
    end
  end
end