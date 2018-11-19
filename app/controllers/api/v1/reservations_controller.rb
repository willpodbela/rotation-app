module Api
    module V1
    class ReservationsController < Api::V1::BaseController
      before_action :validate_ownership, only: [:destroy, :show, :update]
    
      # Overriding Super
      # DELETE /api/{plural_resource_name}/1
      def destroy
        if get_resource.scheduled?
          if get_resource.update(:status => :cancelled)
            render :show
          else
            render_error(:unprocessable_entity, get_resource.errors.full_messages.to_sentence)
          end
        else
          render_error(400, "Cannot cancel reservation with status "+get_resource.status+".")
        end
      end
    
      # Failsafe: Override endpoints that we don't want to make available
      # NOTE: (#BETA) For beta there is no use case where a user can "update" a reservation, they can
      # only create and cancel (via DELETE/destroy endpoint) them.
      def update
        render_error(405)
      end
    
      def info
        render :status => 200, :json => {
          :reservations_remaining => current_user.reservations_remaining, 
          :next_period => current_user.legacy_next_reservation_period,
          :est_delivery_date => current_user.est_delivery_date
        }
      end
    
      private
    
      def reservation_params
        # NOTE: (#BETA) Per the 2-week cycles and reservation restrictions of the beta we will
        # automatically assign the start and end dates to incoming create request.
        params[:reservation][:user_id] = current_user.id
        params.require(:reservation).permit(:item_id, :user_id)
      end

      def query_params
        params[:user_id] = current_user.id
        params.permit(:user_id)
      end
    
      def validate_ownership
        unless get_resource.user_id == current_user.id
          render_error(403)
        end
      end
    end
  end
end