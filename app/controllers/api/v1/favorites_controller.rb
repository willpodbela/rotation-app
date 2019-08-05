module Api
    module V1
    class FavoritesController < Api::V1::BaseController
      
      #Failsafe: Override endpoints that we don't want to make available
      def index
        render_error(405)
      end
      def show
        render_error(405)
      end
      def update
        render_error(405)
      end
    
      private
    
      def favorite_params
        # user_id is set using authentication_token pass in header, item_id is a path param
        params[:user_id] = current_user.id
        params.permit(:item_id, :user_id)
      end

      def query_params
        params.permit()
      end
      
      def set_resource(resource = nil)
        resource ||= resource_class.find_by(user_id: current_user.id, item_id: params[:item_id])
        
        if resource.nil?
          render_error(404)
        end
        
        # Set instance variables for use in the global view template (fallback if no :show template is provided)
        instance_variable_set("@global_view_template_data", resource)
        instance_variable_set("@global_view_template_name", resource_name)
      
        instance_variable_set("@#{resource_name}", resource)
      end
      
    end
  end
end