class LandingController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :status, :sign_up]
  before_action :enforce_access_control_admin!, only: [:admin]
  
  layout "devise"
  
  # Home Page
  def index
  end
  
  # Displays waitlist status or download link to non-admin users.
  def status
  end
  
  # Admin Landing Page
  def admin
  end
  
  # AJAX endpoint for sign-up form on Home Page to call
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
  
  private
  
  def user_params
    params.permit(:email,:password)
  end
end
