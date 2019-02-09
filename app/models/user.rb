class User < ApplicationRecord
  has_many :reservations
  has_many :items, through: :reservations
  has_one  :profile
  has_many :devices
  has_many :subscriptions
  belongs_to  :referral_code, optional: true
  
  scope :paying_customers, -> { joins(:subscriptions).merge(Subscription.valid) }
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable
  
  before_save :ensure_authentication_token
  
  after_save do |user|
    user.create_profile unless user.profile.present?
  end
  
  enum access_level: [ :waitlist, :standard, :admin ]
  
  def ensure_authentication_token
    if authentication_token.blank?
      renew_authentication_token
    end
  end
  
  def renew_authentication_token
    self.authentication_token = generate_authentication_token
  end
  
  def send_notification(message)
    self.devices.each do |device|
      device.send_notification(message)
    end
  end
  
  def current_subscription
    self.subscriptions.current.valid.first
  end
  
  def reservations_remaining
    2 - self.reservations.live.count - self.reservations.scheduled.count
  end
  
  def est_delivery_date
    shipping_delay = defined?(self.shipping_delay) ? self.shipping_delay : 3
    Date.today+shipping_delay
  end
  
  # DEPRECATED: iOS app <= v1.1
  # We must provide a reservation period for legacy versions of the iOS app, as a stop gap
  # solution, we just take the estimated delivery date and add 30 days as the "end" of the
  # reservation even though there is no "end" anymore.
  def legacy_next_reservation_period
    { :start_date => est_delivery_date, :end_date => est_delivery_date+30 }
  end
  
  private
  
  def generate_authentication_token
    loop do
      token = SecureRandom.hex
      break token unless User.where(authentication_token: token).first
    end
  end
end
