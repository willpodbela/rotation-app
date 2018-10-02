class Device < ApplicationRecord
  belongs_to :user
  
  def send_notification(message)   
    apns = (ENV['APN_ENVIRONMENT'] == 'production') ? Houston::Client.production : Houston::Client.development
    n = Houston::Notification.new(device: self.token)
    n.alert = message
    apns.push(n)
    
    # n = Rpush::Apns::Notification.new
#     n.app = Rpush::Apns2::App.find_by_name("rotation_ios")
#     n.device_token = self.token
#     n.alert = message
#     n.save!
  end
end
