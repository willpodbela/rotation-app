module Api
    module V1
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
      
        if display_params[:sort_by_section] == "true"
          @my_rotation = Item.my_rotation(current_user)
          @up_next = Item.up_next(current_user)
          @catalog = Item.catalog(current_user)
        
          render :sorted_index
        else 
          render :index
        end
      end
    
      private
    
      def item_params
        params.permit()
      end

      def query_params
        params.permit()
      end
    
      def display_params
        params.permit(:sort_by_section)
      end
    
      def set_current_user
        @current_user = current_user
      end
    end
  end
end