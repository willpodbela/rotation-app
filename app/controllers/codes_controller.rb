class CodesController < ApplicationController
  before_action :enforce_access_control_admin!
  before_action :resource_name
  
  def index
    @codes = code_class.all
  end

  def show
    @code = code_class.find(params[:id])
  end

  def new
    @code = code_class.new()
  end
  
  def create
    # Instantiate a new object using form parameters
    @code = code_class.new(code_params)
    # Save the object
    if @code.save
      # If save succeeds, redirect to the index action
      flash[:notice] = "#{resource_name} created successfully."
      redirect_to()
    else
      # If save fails, redisplay the form so user can fix problems
      render('new')
    end
  end

  def edit
    @code = code_class.find(params[:id])
  end
  
  def update
    # Find a new object using form parameters
    @code = code_class.find(params[:id])
    # Update the object
    if @code.update_attributes(code_params)
      # If save succeeds, redirect to the show action
      flash[:notice] = "#{resource_name} updated successfully."
      redirect_to(advertisement_code_path(@code))
    else
      # If save fails, redisplay the form so user can fix problems
      render('edit')
    end
  end
  
  private
  
  def code_params
    params.require(resource_name).permit(:id, :description, :active)
  end
  
  def resource_name
    ""
  end
end