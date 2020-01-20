class Reservation < ApplicationRecord
  belongs_to :item
  belongs_to :user
  belongs_to :unit, optional: true
  
  scope :live, -> { where(status: [:processing, :active, :returned]) }
  scope :scheduled, -> { where(status: [:scheduled]) }
  scope :not_cancelled, -> { where.not(status: :cancelled) }
  
  # NOTE: If size is not set, will return nil -- size should always be set before this is used
  has_many :units_available_for_fulfillment, -> (object) { where(size: object.size) }, class_name: "Unit", through: :item, source: :units_available_for_fulfillment
  
  enum size: [ :S, :M, :L, :XL ]
  enum status: [ :scheduled, :processing, :active, :returned, :ended, :cancelled ]
  
  def days
    d = end_date || Time.zone.now
    (d - start_date).to_i/1.day
  end
  
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
    
    u = reservation.user
    CustomerFeedbackMailer.with(user: reservation.user).inactive_user.deliver_later(wait_until: CustomerFeedbackMailer.preferred_time.advance(months: 3, days: 1))
    unless u.current_subscription.nil?
      if u.reservations.not_cancelled.where("created_at  > ?", 1.month.ago).count >= 3*u.current_subscription.item_qty
        CustomerFeedbackMailer.with(user: reservation.user).heavy_user.deliver_later(wait_until: CustomerFeedbackMailer.preferred_time)
      end
    end
  end
  
  after_save do |reservation|
    # If status changed call item & unit to update_counter_cache
    if reservation.saved_change_to_status?
      reservation.item.update_counter_cache 
      unless reservation.unit.nil?
        reservation.unit.update_counter_cache
      end
    end
    # If unit was assigned or removed update_counter_cache
    if reservation.saved_change_to_unit_id?
      unit_was = Unit.find_by_id(reservation.unit_id_before_last_save)
      unless unit_was.nil?
        unit_was.update_counter_cache
      end
      
      unit_curr = Unit.find_by_id(reservation.unit_id)
      unless unit_curr.nil?
        unit_curr.update_counter_cache
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