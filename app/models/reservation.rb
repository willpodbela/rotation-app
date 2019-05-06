class Reservation < ApplicationRecord
  belongs_to :item
  belongs_to :user
  belongs_to :unit, optional: true
  
  scope :live, -> { where(status: [:processing, :active, :returned]) }
  scope :scheduled, -> { where(status: [:scheduled]) }
    
  # NOTE: If size is not set, will return nil -- size should always be set before this is used
  has_many :units_available_for_fulfillment, -> (object) { where(size: object.size) }, class_name: "Unit", through: :item, source: :units_available_for_fulfillment
  
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
    # Call item & unit to update_counter_cache
    reservation.item.update_counter_cache
    unless reservation.unit.nil?
      reservation.unit.update_counter_cache
    end
    # We'll use Active Record Callbacks to send fulfillment notification emails to the team
    ReservationMailer.with(reservation: reservation).reservation_created.deliver
  end
  
  after_save do |reservation|
    # If status changed call item & unit to update_counter_cache
    if reservation.saved_change_to_status?
      reservation.item.update_counter_cache 
      unless reservation.unit.nil?
        reservation.unit.update_counter_cache
      end
    end
    # We'll use Active Record Callbacks to send fulfillment notification emails to the team
    ReservationMailer.with(reservation: reservation).reservation_cancelled.deliver if reservation.cancelled?
  end
  
  after_destroy do |reservation|
    # Call item & unit to update_counter_cache
    reservation.item.update_counter_cache
    unless reservation.unit.nil?
      reservation.unit.update_counter_cache
    end
  end
end