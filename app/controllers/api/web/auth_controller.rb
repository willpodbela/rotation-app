module Api
  module Web
    class AuthController < Api::Web::BaseController
      skip_before_action :authenticate_user_from_token!, only: [:login, :forgot]
    
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
      def index
        render_error(405)
      end
      def show
        render_error(405)
      end
    
      #[GET] login endpoint
      def login
        @user = User.find_by_email(params[:email])
        if @user
          if @user.valid_password?(params[:password])
            @user.renew_authentication_token(:web)
            if @user.save
              render('api/web/users/show')
            else
              render_error(500, nil)
            end 
          else
            render_error(403, "Invalid email/password combination")
          end
        else 
          render_error(403, "No such user exists.")
        end
      end
    
      #[GET] logout endpoint
      def logout
        current_user.web_authentication_token = nil
        current_user.save
        sign_out current_user
        render :status=>200, :json=>{}
      end
    
      #[GET] forgot endpoint
      def forgot
        user = User.find_by_email(params[:email])
        if user
          user.send_reset_password_instructions
          render :status=>200, :json=>{}
        else
          render_error(403, "No such user exists.")
        end
      end
    
      private

      #should never be called due to the fact that update/create are disabled
      def auth_params
        params
      end
    end
  end
end
