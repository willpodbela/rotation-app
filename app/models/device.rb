class Device < ApplicationRecord
  belongs_to :user
  
  def send_notification(message)
    APN = Houston::Client.development
    APN.certificate = File.read(ENV['APNS_CERT_PATH'])
    
    n = Houston::Notification.new(device: self.token)
    notification.alert = message
    APN.push(n)
    
    # n = Rpush::Apns::Notification.new
#     n.app = Rpush::Apns2::App.find_by_name("rotation_ios")
#     n.device_token = self.token
#     n.alert = message
#     n.save!
  end
end
