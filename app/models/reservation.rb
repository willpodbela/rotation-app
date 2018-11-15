class Reservation < ApplicationRecord
  belongs_to :item
  belongs_to :user
  
  scope :for_user, ->(user) { where(user: user) }
  scope :live, -> { where(status: [:sent, :active, :returned]) }
  scope :scheduled, -> { where(status: [:scheduled]) } 
  
  enum status: [ :scheduled, :sent, :active, :returned, :ended, :cancelled ]
  
  before_create do |reservation|
    # For now, since the iOS front end is showing the "start date" as the date the customer will receive the clothes we'll set it to today + a shipping period, which we'll default to 3 days
    shipping_delay = defined?(reservation.user.shipping_delay) ? reservation.user.shipping_delay : 3
    reservation.start_date = Date.today+shipping_delay
  end
  
  before_save do |reservation|
    # If reservation is ended, set its end_date
    if [:scheduled, :sent, :active, :returned].include? reservation.status_was && [:ended, :cancelled].include? reservation.status
      reservation.start_date = Date.today
    end
  end
  
  # We'll use Active Record Callbacks to send fulfillment notification emails to the team
  after_create do |reservation|
    ReservationMailer.with(reservation: reservation).reservation_created.deliver
  end
  
  after_save do |reservation|
    ReservationMailer.with(reservation: reservation).reservation_cancelled.deliver if reservation.cancelled?
  end
end