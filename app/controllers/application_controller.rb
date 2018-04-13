class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :generate_access_control_methods!
  before_action :authenticate_user!
  
  private
  
  #set devise to redirect to status after successful login
  def after_sign_in_path_for(resource)
    status_path
  end
  
  def generate_access_control_methods!
    class << self
      User.access_levels.each do |key, value|
        define_method :"enforce_access_control_#{key}!" do
          enforce_access_control(value)
        end
      end
    end
  end
  
  def enforce_access_control(min_access)
    unless current_user
      authenticate_user!
    end
    unless (User.access_levels[current_user.access_level] >= min_access)
      flash[:alert] = "Access Denied. Head back to the iOS app (or come work for us)!"
      sign_out(current_user)
      redirect_to new_user_session_path
    end
  end
end
