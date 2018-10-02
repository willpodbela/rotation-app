class Device < ApplicationRecord
  belongs_to :user
  
  def send_notification(message)   
    apns = (ENV['APN_ENVIRONMENT'] == 'production') ? Houston::Client.production : Houston::Client.development
    n = Houston::Notification.new(device: self.token)
    n.alert = message
    apns.push(n)
  end
end
