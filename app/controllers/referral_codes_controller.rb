class ReferralCodesController < ApplicationController
  before_action :enforce_access_control_admin!

  def index
    @referral_codes = ReferralCode.all
  end

  def show
    @referral_code = ReferralCode.find(params[:id])
  end

  def new
    @referral_code = ReferralCode.new()
  end
  
  def create
    # Instantiate a new object using form parameters
    @referral_code = ReferralCode.new(referral_code_params)
    # Save the object
    if @referral_code.save
      # If save succeeds, redirect to the index action
      flash[:notice] = "Subject created successfully."
      redirect_to()
    else
      # If save fails, redisplay the form so user can fix problems
      render('new')
    end
  end

  def edit
    @referral_code = ReferralCode.find(params[:id])
  end
  
  def update
    # Find a new object using form parameters
    @referral_code = ReferralCode.find(params[:id])
    # Update the object
    if @referral_code.update_attributes(referral_code_params)
      # If save succeeds, redirect to the show action
      flash[:notice] = "Referral Code updated successfully."
      redirect_to(referral_code_path(@referral_code))
    else
      # If save fails, redisplay the form so user can fix problems
      render('edit')
    end
  end
  
  def destroy
    @referral_code = ReferralCode.find(params[:id])
    @referral_code.destroy
    flash[:notice] = "Referral Code '#{@referral_code.title}' destroyed successfully."
    redirect_to(referral_codes_path)
  end
  
  private
  
  def referral_code_params
    params.require(:referral_code).permit(:code, :description)
  end
end
