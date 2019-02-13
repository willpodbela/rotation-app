class LandingController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :sign_up, :download, :privacy]
  before_action :enforce_access_control_admin!, only: [:admin]
  layout :resolve_layout
  
  prepend_before_action do
    if display_params[:ios_init] == "true"
      session[:ios_init] = true
    end
  end
  
  # Home Page
  def index
  end
  
  # Displays waitlist status or download link to non-admin users.
  def status
    Stripe.api_key = Rails.configuration.stripe[:secret_key]
    @plan = Stripe::Plan.retrieve(stripe_plan_id)
    
    @current_subscription = current_user.current_subscription
  end
  
  # Admin Landing Page
  def admin
  end
  
  def download
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
        if browser.platform.ios?
          render :status=>200, :json => { "redirect":"/download" }
        else
          render :status=>200, :json => { "redirect":"/status" }
        end
      else
        render :status=>400, :json => { "message": @user.errors.full_messages.first }
      end
    end
  end
  
  private
  
  def user_params
    params.permit(:email,:password, :password_confirmation)
  end

  def resolve_layout
    case action_name
    when "status"
      "status"
    else
      "landing"
    end
  end
  
  def stripe_plan_id
    ENV['STRIPE_PLAN_ID']
  end
  
  def display_params
    params.permit(:ios_init)
  end
end
