module Api
    module V1
    class ProfilesController < Api::V1::BaseController
      before_action :enforce_user_permission!
      before_action :create_profile
    
      #Failsafe: Override endpoints that we don't want to make available
      def destroy
        render_error(405)
      end
      def create
        render_error(405)
      end
      def index
        render_error(405)
      end
    
      private
    
      def profile_params
        params.require(:profile).permit(:first_name, :last_name, :instagram_auth_token, :address_line_one, :address_line_two, :address_city, :address_state, :address_zip, :auto_pilot, :preferred_sizes => [])
      end

      def query_params
        params.permit()
      end
    
      def enforce_user_permission!
        unless params[:user_id].to_i == current_user.id
          render_error(403)
        end
      end
    
      def create_profile
        # Create a Profile object for them if it does not exist
        unless current_user.profile
          current_user.create_profile
          set_resource
        end
      end
    
      def set_resource(resource = nil)
        resource ||= current_user.profile
      
        # Set instance variables for use in the global view template (fallback if no :show template is provided)
        instance_variable_set("@global_view_template_data", resource)
        instance_variable_set("@global_view_template_name", resource_name)
      
        instance_variable_set("@#{resource_name}", resource)
      end
    end
  end
end