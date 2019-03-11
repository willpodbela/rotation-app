class CouponsController < ApplicationController
  before_action :set_code!

  def new
    
  end

  def create
    begin
      print(coupon_params)
      StripeService.create_coupon(@code, coupon_params)
      redirect_to(self.send("#{@code.type.underscore.pluralize}_path"))
    rescue => e
      flash[:alert] = "Error: #{e.message}"
      render('new')
    end
  end
  
  private
  
  def coupon_params
    params.require(:coupon).permit(:percent_off, :amount_off)
    ret = {:duration => "once"}
    if i = params[:coupon][:percent_off].to_f
      ret[:percent_off] = i if i > 0 && i <= 100
    end
    if i = params[:coupon][:amount_off].to_f
      if i > 0
        ret[:amount_off] = (i*100).to_i
        ret[:currency] = 'usd'
      end
    end
    return ret
  end
  
  def set_code!
    code_id ||= params[:advertisement_code_id]
    code_id ||= params[:referral_code_id]
    unless @code = Code.find_by_id(code_id)
      flash[:alert] = "Bad URL. That code is not valid."
      redirect_to admin_path
    end
  end
end
