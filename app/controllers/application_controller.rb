class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :generate_access_control_methods!
  before_action :authenticate_user!
  before_action :advertisement_tracking
  
  private
  
  #set devise to redirect to status after successful login
  def after_sign_in_path_for(resource)
    if resource.admin?
      admin_path
    else
      status_path
    end
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
  
  def advertisement_tracking
    if !session.has_key?(:advertisement_code) && params.has_key?(:campaign)
      code = params[:campaign]
      session[:advertisement_code] = code
      a = AdvertisementCode.find_by_code(code)
      unless a
        a = AdvertisementCode.create(:description => "Auto-detected tracking code.", :code => code)
      end
      a.session_count = a.session_count + 1
      a.save
    end
  end
end
