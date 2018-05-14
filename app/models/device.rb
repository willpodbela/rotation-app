class Device < ApplicationRecord
  belongs_to :user
  
  def send_notification(message)
    n = Rpush::Apns::Notification.new
    n.app = Rpush::Apns::App.find_by_name("rotation_ios")
    n.device_token = self.token
    n.alert = message
    #n.data = { foo: :bar }     #Can be used to customize sound
    n.save!
  end
end
