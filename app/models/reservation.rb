class Reservation < ApplicationRecord
  belongs_to :item
  belongs_to :user
  belongs_to :unit, optional: true
  
  scope :live, -> { where(status: [:processing, :active, :returned]) }
  scope :scheduled, -> { where(status: [:scheduled]) }
  
  enum size: [ :S, :M, :L, :XL ]
  enum status: [ :scheduled, :processing, :active, :returned, :ended, :cancelled ]
  
  before_create do |reservation|
    reservation.start_date = Date.today
  end
  
  before_save do |reservation|
    # If reservation is ended, set its end_date
    reservation.end_date = Date.today if ((["scheduled", "processing", "active", "returned"].include? reservation.status_was) && (["ended", "cancelled"].include? reservation.status))
  end
  
  after_create do |reservation|
    # Call item to update_counter_cache
    reservation.item.update_counter_cache
    # We'll use Active Record Callbacks to send fulfillment notification emails to the team
    ReservationMailer.with(reservation: reservation).reservation_created.deliver
  end
  
  after_save do |reservation|
    # If status changed call item to update_counter_cache
    reservation.item.update_counter_cache if reservation.saved_change_to_status?
    # We'll use Active Record Callbacks to send fulfillment notification emails to the team
    ReservationMailer.with(reservation: reservation).reservation_cancelled.deliver if reservation.cancelled?
  end
  
  after_destroy do |reservation|
    # Call item to update_counter_cache
    reservation.item.update_counter_cache
  end
  
  # NOTE: If size is not set, will return nil -- size should always be set before this is used
  def assignable_units
    item.units.available_for_rent.where(size: size)
  end
end