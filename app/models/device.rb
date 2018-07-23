class Device < ApplicationRecord
  belongs_to :user
  
  def send_notification(message)
    n = Rpush::Apns::Notification.new
    n.app = Rpush::Apns2::App.find_by_name("rotation_ios")
    n.device_token = self.token
    n.alert = message
    n.data = { 'headers' => { 'apns-topic' => 'com.rotationinc.Rotation' }} #Can also be used to customize sound
    n.save!
  end
end
