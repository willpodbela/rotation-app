class JobsController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :set_jobs
  layout 'landing'
  
  def index
  end

  def show
    if @jobs.keys.include? params[:id]
      render(params[:id])
    else
      raise ActionController::RoutingError.new('Not Found')
    end
  end
  
  private
  
  def set_jobs
    @jobs = {"buyer" => "👕 Lead Buyer and Planner"}
  end
end
