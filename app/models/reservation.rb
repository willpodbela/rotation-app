class Reservation < ApplicationRecord
  belongs_to :item
  belongs_to :user
  belongs_to :unit, optional: true
  has_and_belongs_to_many :shipments, optional: true
  
  scope :live, -> { where(status: [:processing, :active, :returned]) }
  scope :scheduled, -> { where(status: [:scheduled]) }
  scope :not_cancelled, -> { where.not(status: :cancelled) }
  
  # NOTE: If size is not set, will return nil -- size should always be set before this is used
  has_many :units_available_for_fulfillment, -> (object) { where(size: object.size) }, class_name: "Unit", through: :item, source: :units_available_for_fulfillment
  
  enum size: [ :S, :M, :L, :XL ]
  enum status: [ :scheduled, :processing, :active, :returned, :ended, :cancelled ]
  
  aircloneable
  
  def days
    d = (end_date || Date.today).to_date
    (d - start_date.to_date).to_i
  end
  
  def days_active(since = nil)
    d = [(end_date || Date.today), since].compact.max.to_date
    s = [start_date, since].compact.max.to_date
    (d - s).to_i
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
    CustomerFeedbackMailer.with(user: u).inactive_user.deliver_later(wait_until: CustomerFeedbackMailer.preferred_time.advance(months: 3, days: 1))
    unless u.current_subscription.nil?
      if u.reservations.not_cancelled.where("created_at  > ?", 1.month.ago).count >= 3*u.current_subscription.item_qty
        CustomerFeedbackMailer.with(user: u).heavy_user.deliver_later(wait_until: CustomerFeedbackMailer.preferred_time)
      end
    end

    ShippingConfirmationMailer.with(user: u).shipping_confirmed.deliver
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