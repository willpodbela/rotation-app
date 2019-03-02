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
        Stripe.api_key = Rails.configuration.stripe[:secret_key]
        
        begin
          StripeService.create_monthly_subscription(current_user, subscription_params[:stripe_source_id])
          render :status=>201, :json=>{}
        rescue Stripe::CardError => e
          # CardError; return the error message.
          render_error(400, e.message)
        rescue => e
          # Some other error; Return 500
          print(e)
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