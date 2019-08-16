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
      def show
        render_error(405)
      end

      def index
        Stripe.api_key = Rails.configuration.stripe[:secret_key]
        @plan = Stripe::Plan.retrieve(stripe_plan_id)

        @current_subscription = current_user.current_subscription
        @is_ios = browser.platform.ios?

        render :status=>status, :json=>{:plan => @plan, :current_subscription => @current_subscription, :is_ios => @is_ios}
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

      def stripe_plan_id
        ENV['STRIPE_PLAN_ID']
      end

    end
  end
end
