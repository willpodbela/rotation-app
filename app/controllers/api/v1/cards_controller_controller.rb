module Api
    module V1
    class CardsControllerController < Api::V1::BaseController
      
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
      
      # Right now, create both creates a new card AND sets it as the default.
      # One day we'll probably want to have create just add the card to the customer, and then have update set default
      def create
        begin
          if current_user.current_subscription.incomplete?
            StripeService.change_payment_and_reattempt_incomplete_monthly_subscription(user, stripe_source_id)
            set_resource(subscription)
            render 'subscriptions/show', status: :created
          else
            StripeService.update_or_create_customer_with_payment(current_user, subscription_params[:stripe_source_id])
            head :ok
          end
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
 
      def card_params
        params.permit(:stripe_source_id)
      end
      
    end
  end
end
