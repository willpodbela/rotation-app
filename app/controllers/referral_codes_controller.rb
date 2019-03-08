class ReferralCodesController < CodesController
    
  private
  
  def code_class
    "ReferralCode".constantize
  end
  
  def resource_name
    @resource_name ||= "referral_code"
  end
end
