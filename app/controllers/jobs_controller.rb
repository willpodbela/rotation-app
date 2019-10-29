class JobsController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :set_jobs
  
  def index
  end

  def show
    if @jobs.include? params[:id]
      render(params[:id])
    else
      raise ActionController::RoutingError.new('Not Found')
    end
  end
  
  private
  
  def set_jobs
    @jobs = ['buyer']
  end
end
