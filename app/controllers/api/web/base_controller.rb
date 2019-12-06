module Api
  module Web
    class BaseController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :authenticate_user_from_token!
      skip_before_action :authenticate_user!
      skip_before_action :advertisement_tracking
      before_action :set_resource, only: [:destroy, :show, :update]
      respond_to :json
    
      # POST /api/{plural_resource_name}
      def create
        set_resource(resource_class.new(resource_params))

        if get_resource.save
          render :show, status: :created
        else
          render_error(:unprocessable_entity, get_resource.errors.full_messages.to_sentence)
        end
      end

      # DELETE /api/{plural_resource_name}/1
      def destroy
        get_resource.destroy
        head :no_content
      end

      # GET /api/{plural_resource_name}
      def index
        plural_resource_name = "@#{resource_name.pluralize}"
        resources = resource_class.where(query_params)
        .page(page_params[:page])
        .per(page_params[:page_size])
      
        instance_variable_set(plural_resource_name, resources)
        respond_with instance_variable_get(plural_resource_name)
      end

      # GET /api/{plural_resource_name}/1
      def show
        respond_with get_resource
      end

      # PATCH/PUT /api/{plural_resource_name}/1
      def update
        if get_resource.update(resource_params)
          render :show
        else
          render_error(:unprocessable_entity, get_resource.errors.full_messages.to_sentence)
        end
      end
    
      private
    
      def render_error(status, message = nil)
        message = message ? message : Rack::Utils::HTTP_STATUS_CODES[status]
        message = message ? message : "An error occured."
        render :status=>status, :json=>{:error => {:message => message}}
      end
      
      # NOTE: So far this is the only class that differs in implementation from
      # Api::V1::BaseController, but for confusion sake it seemed more sensible not to
      # subclass so that web could exist as its own entity unaffected by iOS api classes
      def authenticate_user_from_token!
        authenticate_or_request_with_http_token do |token, options|
          current_user = User.find_by_web_authentication_token(token)
          if current_user
            sign_in current_user, store: false
          else
            render_error(403, "Invalid or missing authentication token")
          end
        end      
      end
      
      # Returns the resource from the created instance variable
      # @return [Object]
      def get_resource
        instance_variable_get("@#{resource_name}")
      end

      # Returns the allowed parameters for searching
      # Override this method in each API controller
      # to permit additional parameters to search on
      # @return [Hash]
      def query_params
        {}
      end

      # Returns the allowed parameters for pagination
      # @return [Hash]
      def page_params
        params.permit(:page, :page_size)
      end

      # The resource class based on the controller
      # @return [Class]
      def resource_class
        @resource_class ||= resource_name.classify.constantize
      end

      # The singular name for the resource class based on the controller
      # @return [String]
      def resource_name
        @resource_name ||= self.controller_name.singularize
      end

      # Only allow a trusted parameter "white list" through.
      # If a single resource is loaded for #create or #update,
      # then the controller for the resource must implement
      # the method "#{resource_name}_params" to limit permitted
      # parameters for the individual model.
      def resource_params
        @resource_params ||= self.send("#{resource_name}_params")
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_resource(resource = nil)
        resource ||= resource_class.find(params[:id])
      
        # Set instance variables for use in the global view template (fallback if no :show template is provided)
        instance_variable_set("@global_view_template_data", resource)
        instance_variable_set("@global_view_template_name", resource_name)
      
        instance_variable_set("@#{resource_name}", resource)
      end
    end
  end
end