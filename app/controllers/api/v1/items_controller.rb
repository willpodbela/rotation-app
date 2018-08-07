module Api
    module V1
    class ItemsController < Api::V1::BaseController
      #http_basic_authenticate_with name:ENV["API_AUTH_NAME"], password:ENV["API_AUTH_PASSWORD"], only: [:create]
      skip_before_action :authenticate_user_from_token!, only: [:create]
      before_action :set_current_user, except: [:create]
      
      #Failsafe: Override endpoints that we don't want to make available
      def destroy
        render_error(405)
      end
      def update
        render_error(405)
      end
      
      # NOTE: Only to be called by our item scraper python script.
      def create
        if Item.create(item_params)
          Item.where("created_at < ?", 2.hours.ago).destroy_all
          render :status=>200, :json=>{}
        else
          render_error(:unprocessable_entity, get_resource.errors.full_messages.to_sentence)
        end
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
        params.permit(array: [:retail_value, :subtitle, :image_url, :title, :buyURL])
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