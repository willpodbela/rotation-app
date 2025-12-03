module Api
  module Web
    class ConfigController < Api::Web::BaseController
      http_basic_authenticate_with name: ENV.fetch("API_AUTH_NAME", ""), password: ENV.fetch("API_AUTH_PASSWORD", "") if ENV["API_AUTH_NAME"].present?
      skip_before_action :authenticate_user_from_token!
    
      #Failsafe: Override endpoints that we don't want to make available
      def create
        render_error(405)
      end
      def destroy
        render_error(405)
      end
      def update
        render_error(405)
      end
      def show
        render_error(405)
      end
      
      def index
        igEnabled = (ENV["INSTAGRAM_ENABLED"] == "true")
        render :status=>200, :json=>{ :instagram_enabled => igEnabled }
      end
      
      private

      #should never be called due to the fact that update/create are disabled
      def config_params
        params
      end
    end
  end
end
