include Queries

module Api
    module V1
    class ItemsController < Api::V1::BaseController
      before_action :set_inventory, only: [:show, :index]
      
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
        @reservation_info = {
          :reservations_remaining => current_user.reservations_remaining, 
          :next_period => current_user.legacy_next_reservation_period,
          :est_delivery_date => current_user.est_delivery_date
        }
        @current_subscription = current_user.current_subscription
        
        # Items logic
        @my_rotation = current_user.my_rotation_items
        @up_next = current_user.up_next_items
        @catalog = current_user.catalog_items
        
        if display_params[:sort_by_section] == "true"          
          render :sorted_index
        else 
          @items = @my_rotation + @up_next + @catalog
          render :index
        end
      end
    
      private
    
      def items_params
        params.permit(items: [:retail_value, :subtitle, :image_url, :title, :buyURL, :image_remote_url, :alternate_image_urls => []])
      end
      
      def item_params
        params.permit()
      end

      def query_params
        params.permit()
      end
    
      def display_params
        params.permit(:sort_by_section)
      end
      
      def set_inventory
        @inventory = Queries::Inventory.new
        @favorite_item_ids = current_user.favorite_items.map(&:id)
      end
      
    end
  end
end
