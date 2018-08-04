class LandingController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :status, :sign_up, :download, :privacy]
  before_action :enforce_access_control_admin!, only: [:admin]
  
  # Home Page
  def index
  end
  
  # Displays waitlist status or download link to non-admin users.
  def status
  end
  
  # Admin Landing Page
  def admin
  end
  
  def download
    # TODO: Add App Store URL once approved!!
    redirect_to "https://itunes.apple.com/us/app/com-rotationinc-rotation/id1404678165?ls=1&mt=8"
  end
  
  # Privacy Page
  def privacy
  end
  
  # AJAX endpoint for sign-up form on Home Page to call
  def sign_up
    # Check if user exists
    if User.find_by_email(user_params[:email])
      link = view_context.link_to "Click here to Log In.", new_user_session_path
      render :status=>400, :json => { "message":("The email is already registered. " + link) }
    else
      # Instantiate a new object using form parameters
      @user = User.new(user_params)
      # Save the object
      if @user.save
        # If save succeeds, sign them in and return 200
        sign_in(@user)
        render :status=>200, :json => { "redirect":"/status" }
      else
        render :status=>400, :json => { "message":"An unknown error occurred. Please try again later." }
      end
    end
  end
  
  private
  
  def user_params
    params.permit(:email,:password)
  end
end
