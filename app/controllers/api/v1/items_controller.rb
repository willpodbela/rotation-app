include Queries

module Api
    module V1
    class ItemsController < Api::V1::BaseController
      skip_before_action :authenticate_user_from_token!, only: [:create]
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
        # Pass reservation info and user subscription info along with call
        # FIXME: We should dry this up later as it was copy pasted directly from ReservationsController
        @reservation_info = {
          :reservations_remaining => current_user.reservations_remaining, 
          :next_period => current_user.legacy_next_reservation_period, #DEPRECATED as of iOS <= v1.1, replaced with :est_delivery_date
          :est_delivery_date => current_user.est_delivery_date
        }
        @current_subscription = current_user.current_subscription
        
        # Items logic
        @items = Item.visible.with_images.where(query_params)
        .page(page_params[:page])
        .per(page_params[:page_size])
        
        if display_params[:sort_by_section] == "true"
          @my_rotation = current_user.my_rotation_items
          @up_next = current_user.up_next_items
          @catalog = current_user.catalog_items
          
          render :sorted_index
        else 
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
      end
      
    end
  end
end