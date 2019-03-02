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

        if current_user.stripe_customer_id? 
          customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)
        else
          begin
            customer = Stripe::Customer.create(
              :email => current_user.email,
              :source  => subscription_params[:stripe_source_id]
            )
            current_user.stripe_customer_id = customer.id
            unless current_user.save
              # TODO: Log error - error with stripe unable to save/create user
              render_error(500, nil)
            else
              
              # Happy path
              stripe_subscription_obj = customer.subscriptions.create({plan: stripe_plan_id})
              response = ServiceResponse.new(stripe_subscription_obj)
              if response.success?
                subsciption = Subscription.new(
                  :user => current_user,
                  :stripe_subscription_obj => stripe_subscription_obj,
                  :stripe_plan_id => stripe_plan_id
                )
                unless subsciption.save
                  # TODO: Log error - stripe succeeded but local obj could not be saved
                end
          
                render :status=>200, :json=>{}
              else
                # TODO: Log error from stripe
                render_error(500, nil)
              end
              
            end
          rescue Stripe::CardError => e
            # CardError; return the error message.
            render_error(400, e.message)
          rescue => e
            # Some other server error; Return 500
            render_error(500, nil)
          end
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