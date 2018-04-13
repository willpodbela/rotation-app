class LandingController < ApplicationController
  skip_before_action :authenticate_user!

  def index
  end
  
  def sign_up
    # Instantiate a new object using form parameters
    @user = User.new(user_params)
    # Save the object
    if @user.save
      # If save succeeds, sign them in and return 200
      sign_in(@user)
      render :status=>200, :json => { "data":"" }
    else
      render :status=>400, :json => { "data":"" }
    end
  end
  
  def status
  end
  
  private
  
  def user_params
    params.permit(:email,:password)
  end
end
