include Queries

module Api
  module Web
    class ItemsController < Api::Web::BaseController
      skip_before_action :authenticate_user_from_token!, only: [:index]
      before_action :authenticate_user_from_token, only: [:index]
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
      
      def index
        if user_signed_in?
          @my_rotation = current_user.my_rotation_items
          @up_next = current_user.up_next_items
          @catalog = current_user.catalog_items
          
          if display_params[:sort_by_section] == "true"          
            render :sorted_index
          else 
            @items = @my_rotation + @up_next + @catalog
            render :index
          end
        else
          if display_params[:landing_featured] == "true"          
            @items = Item.landing_featured
          else 
            @items = Item.visible
          end
          @items = @items.with_images.order(created_at: :desc)
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
        params.permit(:sort_by_section, :landing_featured)
      end
      
      def set_inventory
        @inventory = Queries::Inventory.new
        unless current_user.nil?
          @favorite_item_ids = current_user.favorite_items.map(&:id)
        end
      end
      
    end
  end
end
