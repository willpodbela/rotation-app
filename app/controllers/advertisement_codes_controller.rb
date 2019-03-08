class AdvertisementCodesController < CodesController
    
  private
  
  def code_class
    "AdvertisementCode".constantize
  end
  
  def resource_name
    @resource_name ||= "advertisement_code"
  end
end
