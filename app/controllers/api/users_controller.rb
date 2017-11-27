module Api
  class UsersController < Api::BaseController
    http_basic_authenticate_with name:ENV["API_AUTH_NAME"], password:ENV["API_AUTH_PASSWORD"]
    skip_before_action :authenticate_user_from_token!
    
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
      render_error(405)
    end
    
    def create    
      begin 
			  decrypted_pass = AESCrypt.decrypt(params[:password], ENV["API_AUTH_PASSWORD"])
			  params[:password] = decrypted_pass
			  super
			rescue Exception => e
			  render_error(:unprocessable_entity, "A network error occured. Please switch to a different network and try again.")
			end
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