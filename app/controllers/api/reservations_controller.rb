module Api
  class ReservationsController < Api::BaseController
    before_action :validate_ownership, only: [:destroy, :show, :update]
    
    # Overriding Super
    # DELETE /api/{plural_resource_name}/1
    def destroy
      if get_resource.update(:status => :cancelled)
        render :show
      else
        render_error(:unprocessable_entity, get_resource.errors.full_messages.to_sentence)
      end
    end
    
    private
    
    def reservation_params
      params[:reservation][:user_id] = current_user.id
      params.require(:reservation).permit(:start_date, :end_date, :item_id, :user_id)
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