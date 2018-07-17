module Api
  module V1
    class UsersController < Api::V1::BaseController
      http_basic_authenticate_with name:ENV["API_AUTH_NAME"], password:ENV["API_AUTH_PASSWORD"], only: [:create]
      skip_before_action :authenticate_user_from_token!, only: [:create]
    
      #Failsafe: Override endpoints that we don't want to make available
      def destroy
        render_error(405)
      end
      def update
        render_error(405)
      end
      def index
        render_error(405)
      end
    
      def show
        if params[:id].to_i == current_user.id
          super
        else
          render_error(403)
        end
      end
    
      def create    
        begin 
          decrypted_pass = AESCrypt.decrypt(params[:password], ENV["API_AUTH_PASSWORD"])
        rescue Exception => e
          return render_error(:unprocessable_entity, "A network error occured. Please switch to a different network and try again.")
        end
      
        params[:password] = decrypted_pass
        super
      end
    
      private
    
      def user_params
        params.permit(:email,:password)
      end

      def query_params
        params.permit(:email)
      end
    end    
  end
end