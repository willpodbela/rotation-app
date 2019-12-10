include Queries

module Api
    module Web
    class ReservationsController < Api::Web::BaseController
      before_action :validate_ownership, only: [:destroy, :show, :update]
            
      def create
        inventory = Queries::Inventory.new
        item = Item.find_by_id(params[:item_id])
      
        if inventory.total_available(item) > 0
          s = user.current_subscription
          if !s.nil?
            if s.active? || s.canceled?
              if !s.past_due?
                if current_user.reservations_remaining > 0
                  super
                else
                  render_error(403, "No more reservations remaining.")
                end
              else
                render_error(403, "Our latest payment attempt failed. Please update your billing info in the account page.")
              end
            else
              render_error(403, "Your subscription is not active. Please purcahse in the account page.")
            end
          else
            render_error(403, "Your subscription is not active. Please purcahse in the account page.")
          end
        else
          render_error(403, "Looks like this item is sold out right now. Please choose a different one.")
        end
      end
      
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
      
      def buy
        # NOTE: Wizard-of-oz MVP -- Send request email to the team and manually engage customer on purchase
        set_resource
        ReservationMailer.with(reservation: get_resource).purchase_requested.deliver
      end
    
      private
    
      def reservation_params
        params[:reservation][:user_id] = current_user.id
        params.require(:reservation).permit(:item_id, :user_id, :size)
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