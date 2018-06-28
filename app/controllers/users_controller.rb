class UsersController < ApplicationController
  before_action :enforce_access_control_admin!
  
  def index
    @users = User.all
  end
  
  def release
    @user = User.find(params[:id])
    @user.access_level = :standard
    if @user.save
      #Send Push Notification
      @user.send_notification("Congrats!! You're off the waitlist. Open up the app and join The Rotation.")
      
      flash[:notice] = "User has been successfully released from the waitlist. Push notification Sent."
    else
      flash[:alert] = "Failed to release user from the waitlist."
    end
    redirect_to(users_path)
  end
end
