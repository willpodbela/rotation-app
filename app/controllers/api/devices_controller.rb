module Api
  class DevicesController < Api::BaseController
    
    #Failsafe: Override endpoints that we don't want to make available
    def update
      render_error(405)
    end
    def create    
      render_error(405)
    end
    def index
      render_error(405)
    end
    
    def destroy
      Device.find_by_token(params[:token]).destroy
      head :no_content
    end
    
    def create    
      if Device.create(:user => current_user, :token => params[:token])
        render text: "", status: :created
      else
        render_error(:unprocessable_entity, get_resource.errors.full_messages.to_sentence)
      end
    end
    
    private
    
    def item_params
      params.permit()
    end

    def query_params
      params.permit()
    end
  end
end