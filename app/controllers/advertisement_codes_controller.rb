class AdvertisementCodesController < ApplicationController
  before_action :enforce_access_control_admin!

  def index
    @advertisement_codes = AdvertisementCode.all
  end

  def show
    @advertisement_code = AdvertisementCode.find(params[:id])
  end

  def new
    @advertisement_code = AdvertisementCode.new()
  end
  
  def create
    # Instantiate a new object using form parameters
    @advertisement_code = AdvertisementCode.new(advertisement_code_params)
    # Save the object
    if @advertisement_code.save
      # If save succeeds, redirect to the index action
      flash[:notice] = "Subject created successfully."
      redirect_to()
    else
      # If save fails, redisplay the form so user can fix problems
      render('new')
    end
  end

  def edit
    @advertisement_code = AdvertisementCode.find(params[:id])
  end
  
  def update
    # Find a new object using form parameters
    @advertisement_code = AdvertisementCode.find(params[:id])
    # Update the object
    if @advertisement_code.update_attributes(advertisement_code_params)
      # If save succeeds, redirect to the show action
      flash[:notice] = "Advertisement Code updated successfully."
      redirect_to(advertisement_code_path(@advertisement_code))
    else
      # If save fails, redisplay the form so user can fix problems
      render('edit')
    end
  end
  
  def destroy
    @advertisement_code = AdvertisementCode.find(params[:id])
    @advertisement_code.destroy
    flash[:notice] = "Advertisement Code '#{@advertisement_code.title}' destroyed successfully."
    redirect_to(advertisement_codes_path)
  end
  
  private
  
  def advertisement_code_params
    params.require(:advertisement_code).permit(:code, :description)
  end
end
