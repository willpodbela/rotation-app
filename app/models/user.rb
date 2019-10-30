class User < ApplicationRecord
  has_many :reservations
  has_many :items, through: :reservations
  has_one  :profile
  has_many :devices
  has_many :subscriptions
  has_many :favorites
  has_many :favorite_items, through: :favorites, source: :item
  belongs_to  :referral_code, optional: true
  belongs_to  :advertisement_code, optional: true
  
  has_many :live_reservations, -> { live }, class_name: "Reservation"
  has_many :scheduled_reservations, -> { scheduled }, class_name: "Reservation"
  has_many :my_rotation_items, through: :live_reservations, source: :item
  has_many :up_next_items, through: :scheduled_reservations, source: :item
  has_many  :current_valid_subscriptions, -> { current.valid }, class_name: "Subscription"
  
  scope :paying_customers, -> { joins(:subscriptions).merge(Subscription.valid) }
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable
  
  before_save :ensure_authentication_token
  validate :did_not_attempt_invalid_referral_code_string
  
  after_save do |user|
    user.create_profile unless user.profile.present?
    MailChimpService.sync_and_tag(user)
  end
  
  enum access_level: [ :waitlist, :standard, :admin ]
  
  attr_accessor :invalid_referral_code_string
  
  def initialize(attributes={})
    super
    @invalid_referral_code_string = false
  end
  
  def referral_code=(value)
    # Enable attribute to be set using String that represents the code (primary key) for the ReferralCode object
    @invalid_referral_code_string = false
    if value.is_a? String
      value = ReferralCode.find_by_id(value)
      @invalid_referral_code_string = value.nil?
    end
    # If value is valid referral_code, take off waitlist
    unless value.nil?
      if value.active?
        self.access_level = :standard if self.waitlist? && ReferralCode.exists?(value.id)
      else
        @invalid_referral_code_string = true
      end
    end
    super(value)
  end
  
  def advertisement_code=(value)
    # Enable attribute to be set using String that represents the code for the ReferralCode object
    if value.is_a? String
      value = AdvertisementCode.create_with(description: "Auto-detected tracking code.").find_or_create_by(id: value)
    end
    super(value)
  end
  
  def did_not_attempt_invalid_referral_code_string
    if @invalid_referral_code_string
      errors.add(:referral_code, "That referral code is not valid. Please try again.")
    end
  end
  
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
    self.current_valid_subscriptions.first
  end
  
  # eager_load live_reservations and scheduled_reservations when planning to make this call
  def reservations_remaining
    2 - self.live_reservations.size - self.scheduled_reservations.size
  end
  
  # eager_load my_rotation_items and up_next_items when planning to make this call
  def catalog_items
    items = Item.visible.with_images.order(created_at: :desc)

    if (r = ReferralCode.find_by_id("FIRSTIN"))
      if current_user.referral_code == r
        items = Item.visible.with_images.or(Item.where(special: true)).order(created_at: :desc)
      end
    end
    items - self.my_rotation_items - self.up_next_items
  end
  
  def est_delivery_date
    shipping_delay = defined?(self.shipping_delay) ? self.shipping_delay : 3
    Date.today+shipping_delay
  end
  
  #returns coupon that is eligible to be applied to a subscription if one exists
  def coupon
    if has_used_promo?
      return nil
    elsif referral_code && (r = referral_code.coupon)
      return r
    elsif advertisement_code && (a = advertisement_code.coupon)
      return a
    end
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
