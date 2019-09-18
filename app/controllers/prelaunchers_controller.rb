class PrelaunchersController < ApplicationController
  skip_before_action :authenticate_user!

  def create
    @prelaunch_user = PrelaunchUser.find_by_email(prelaunch_user_params[:email])
    unless @prelaunch_user.nil?
      prelaunch_user_success(@prelaunch_user)
    else
      @prelaunch_user = PrelaunchUser.new(prelaunch_user_params)
      if @prelaunch_user.save
        prelaunch_user_success(@prelaunch_user)
      else
        # If save fails, redisplay the form so user can fix problems
        render('landing/index')
      end
    end
  end
  
  def show
    # Validate prelaunch_user has been set, otherwise return to landing page
    @prelaunch_user = PrelaunchUser.find_by_email(cookies[:prelaunch_email])
    redirect_to root_path if @user.nil?
  end
  
  private
  
  def prelaunch_user_params
    params.require(:prelaunch_user).permit(:email, :inviter_id)
  end
  
  def prelaunch_user_success(prelaunch_user)
    cookies.permanent[:prelaunch_email] = @user.email
    redirect_to(prelaunch_path)
  end
end
