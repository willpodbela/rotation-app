class ProfilesController < ApplicationController
  before_action :enforce_access_control_admin!
  before_action :set_user_and_create_profile
  
  def show
    @profile = @user.profile
  end
  
  def edit
    @profile = @user.profile
  end
  
  def update
    # Find a new object using form parameters
    @profile = @user.profile
    
    # Update the object
    if @profile.update_attributes(profile_params)
      # If save succeeds, redirect to the show action
      flash[:notice] = "Reservation updated successfully."
      redirect_to(user_profile_path(@user, @profile))
    else
      # If save fails, redisplay the form so user can fix problems
      render('edit')
    end
  end
  
  private
  
  def profile_params
    params.require(:profile).permit(:first_name, :last_name, :address_line_one, :address_line_two, :address_city, :address_state, :address_zip)
  end
  
  def set_user_and_create_profile
    # Set User
    @user = User.find(params[:user_id])
    
    # Create a Profile object for them if it does not exist
    unless @user.profile
      @user.create_profile
    end
  end
end
