module Api
  class DevicesController < Api::BaseController
    
    #Failsafe: Override endpoints that we don't want to make available
    def update
      render_error(405)
    end
    def show    
      render_error(405)
    end
    def index
      render_error(405)
    end
    
    def destroy
      #Make sure device belongs to user
      if get_resource
        if get_resource.user_id == current_user.id
          super
        else
          render_error(403)
        end
      else
        render_error(:unprocessable_entity, "No devices found for token.")
      end
    end
    
    def create
      #If device already registered, unregister it
      if Device.find_by_token(params[:token]).destroy
      super
    end
    
    private
    
    def device_params
      params[:user_id] = current_user.id
      params.permit(:token, :user_id)
    end

    def query_params
      params.permit()
    end
    
    #Override set_resource
    def set_resource(resource = nil)
      resource ||= resource_class.find_by_token(params[:token])
      
      # Set instance variables for use in the global view template (fallback if no :show template is provided)
      instance_variable_set("@global_view_template_data", resource)
      instance_variable_set("@global_view_template_name", resource_name)
      
      instance_variable_set("@#{resource_name}", resource)
    end
  end
end