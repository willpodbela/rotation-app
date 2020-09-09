class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :generate_access_control_methods!
  before_action :authenticate_user!, except: [:react_index_html, :react_non_html]
  before_action :advertisement_tracking
  before_action :login_redirect
  
  def react_index_html
    render :file => 'public/react.html', layout: false
  end
  
  def react_non_html
    render :file => "public/#{params[:path]}", layout: false
  end
  
  private
  
  #set devise to redirect to status after successful login
  def after_sign_in_path_for(resource)
    if session.has_key?(:redirect)
      return self.send(session[:redirect].underscore+"_path")
    else
      if resource.admin?
        admin_path
      else
        root_path
      end
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
      a = AdvertisementCode.create_with(description: "Auto-detected tracking code.").find_or_create_by(id: code)
      a.session_count = a.session_count + 1
      a.save
    end
  end
  
  def login_redirect
    if params.has_key?(:redirect)
      session[:redirect] = params[:redirect]
    end
  end
  
end
