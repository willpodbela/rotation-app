class PrelaunchersController < ApplicationController
  skip_before_action :authenticate_user!

  # Landing POST Email
  def create
    cookies.permanent[:prelaunch_email] = prelauncher_params[:prelaunch_user][:email]
    redirect_to(prelaunch_path)
  end
  
  # Invite Page
  def show
    # Validate prelaunch_user has been set, otherwise return to landing page
    unless cookies[:prelaunch_email].present?
      redirect_to root_path
    else
      @user = PrelaunchUser.find_or_create_by(email: cookies[:prelaunch_email])
    end
  end
  
  private
  
  def prelauncher_params
    params.require(:prelaunch_user).permit(:email)
  end
  
end
