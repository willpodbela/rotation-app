require 'houston'

class Device < ApplicationRecord
  belongs_to :user
  
  def send_notification(message)   
    n = Houston::Notification.new(device: self.token)
    n.alert = message
    APN.push(n)
    
    # n = Rpush::Apns::Notification.new
#     n.app = Rpush::Apns2::App.find_by_name("rotation_ios")
#     n.device_token = self.token
#     n.alert = message
#     n.save!
  end
end
