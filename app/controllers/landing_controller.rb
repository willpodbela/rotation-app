class LandingController < ApplicationController
  skip_before_action :authenticate_user!, only: [:download]
  before_action :enforce_access_control_admin!, only: [:admin]
  
  # Admin Landing Page
  def admin
  end
  
  def download
    redirect_to "https://itunes.apple.com/us/app/com-rotationinc-rotation/id1404678165?ls=1&mt=8"
  end
  
end
