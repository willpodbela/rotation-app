module Api
  module V1
    class UsersController < Api::V1::BaseController
      http_basic_authenticate_with name:ENV["API_AUTH_NAME"], password:ENV["API_AUTH_PASSWORD"], only: [:create]
      skip_before_action :authenticate_user_from_token!, only: [:create, :sign_up]
    
      #Failsafe: Override endpoints that we don't want to make available
      def destroy
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
      
      def sign_up
        # Check if user exists
        if User.find_by_email(user_params[:email])
          render :status=>400, :json => { :message => "The email is already registered. ", :link => { :message => "Click here to Log In.", :url => "/login" } }
        else
          # Instantiate a new object using form parameters
          @user = User.new(user_params)
          @user.advertisement_code = session[:advertisement_code]
          
          # Save the object
          if @user.save
            render :show
          else
            render :status=>400, :json => { "message": @user.errors.full_messages.first }
          end
        end
      end
    
      private
    
      def user_params
        params.permit(:email,:password,:password_confirmation, :referral_code,:advertisement_code)
      end

      def query_params
        params.permit(:email)
      end
    end    
  end
end