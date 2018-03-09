module Api
  class ItemsController < Api::BaseController
    before_action :set_current_user
    
    #Failsafe: Override endpoints that we don't want to make available
    def destroy
      render_error(405)
    end
    def update
      render_error(405)
    end
    def create    
      render_error(405)
    end
    
    # Override: GET /api/{plural_resource_name}
    def index
      @items = resource_class.where(query_params)
      .page(page_params[:page])
      .per(page_params[:page_size])
      
      render :index
    end
    
    private
    
    def item_params
      params.permit()
    end

    def query_params
      params.permit()
    end
    
    def set_current_user
      @current_user = current_user
    end
  end
end