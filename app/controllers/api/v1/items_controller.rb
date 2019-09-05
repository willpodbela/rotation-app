include Queries

module Api
    module V1
    class ItemsController < Api::V1::BaseController
      skip_before_action :authenticate_user_from_token!, only: [:list]
      before_action :set_inventory, only: [:show, :index, :list]
      
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
      
      def list
        common_index
      end
    
      # Override: GET /api/{plural_resource_name}
      def index
        #DEPRECATED as of iOS <= v1.1.7, this data is now passed with the user object in users#show
        @reservation_info = {
          :reservations_remaining => current_user.reservations_remaining, 
          :next_period => current_user.legacy_next_reservation_period,
          :est_delivery_date => current_user.est_delivery_date
        }
        @current_subscription = current_user.current_subscription
        #END DEPRECATED
        
        if display_params[:sort_by_section] == "true"
          common_index(:sorted_index)
        else 
          common_index(:index)
        end
      end
      
      private
      
      def common_index(render_template = :list)
        # Items logic
        if (current_user.nil?)
          @items = Item.visible.with_images.where(query_params)
          .page(page_params[:page])
          .per(page_params[:page_size])
        else
          @my_rotation = current_user.my_rotation_items
          @up_next = current_user.up_next_items
          @catalog = current_user.catalog_items
          
          @items = @my_rotation + @up_next + @catalog
        end
        
        render render_template
      end
    
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
        @favorite_item_ids = current_user.favorite_items.map(&:id) unless current_user.nil? 
      end
      
    end
  end
end