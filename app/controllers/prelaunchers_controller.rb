class PrelaunchersController < ApplicationController
  skip_before_action :authenticate_user!
  layout "landing"

  def create
    
    
    @prelaunch_user = PrelaunchUser.find_by_email(prelaunch_user_params[:email])
    unless @prelaunch_user.nil?
      create_success(@prelaunch_user)
    else
      @prelaunch_user = PrelaunchUser.new(prelaunch_user_params)
      if @prelaunch_user.save
        create_success(@prelaunch_user)
      else
        # If save fails, redisplay the form so user can fix problems
        render('landing/index')
      end
    end
  end
  
  def show
    # If user signed in, use that for invite page
    if user_signed_in?
      @prelaunch_user = PrelaunchUser.find_or_create_by(email: current_user.email)
      cookies.permanent[:prelaunch_email] = @prelaunch_user.email
    end
    
    # If prelaunch_user is still nil, try to load prelaunch_user from cookie
    @prelaunch_user ||= PrelaunchUser.find_by_email(cookies[:prelaunch_email])
    
    if @prelaunch_user.nil?
      # If still nil, send user to landing page
      redirect_to root_path
    else
      # Else, prelaunch user is set, continue with render of invite page
      @friend_count = @prelaunch_user.invited_users.count
      @invite_url = root_url(:ref => @prelaunch_user.invite_code)
    end
  end
  
  private
  
  def prelaunch_user_params
    params.require(:prelaunch_user).permit(:email, :inviter_id)
  end
  
  def create_success(prelaunch_user)
    cookies.permanent[:prelaunch_email] = prelaunch_user.email
    
    # This is the result of a click on submit on the landing form, so if user is signed in to a different email, sign them out.
    if user_signed_in? && (current_user.email != prelaunch_user.email)
      sign_out current_user
    end
    
    redirect_to(prelauncher_path)
  end
end
