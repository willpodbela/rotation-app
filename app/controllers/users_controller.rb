class UsersController < ApplicationController
  before_action :enforce_access_control_admin!
  
  def index
    @users = User.all
  end
  
  def release
    @user = User.find(params[:id])
    @user.access_level = :standard
    if @user.save
      flash[:notice] = "User has been successfully released from the waitlist."
    else
      flash[:alert] = "Failed to release user from the waitlist."
    end
    redirect_to(users_path)
  end
end
