class Unit < ApplicationRecord
  belongs_to :item
  has_many   :reservations
  
  scope :available_for_rent, -> { where(status: [:in_transit_from_supplier, :available]) }
  scope :owned, -> { where(status: [:in_transit_from_supplier, :available, :offline]) }
  
  has_many   :live_reservations, -> { live }, class_name: "Reservation"
  has_many   :scheduled_reservations, -> { scheduled }, class_name: "Reservation"
  
  enum size: [ :S, :M, :L, :XL ]
  enum status: [ :pending, :in_transit_from_supplier, :available, :sold, :returned, :retired, :offline ]
  
  def total_cost
    (cost || 0) + (supplier_shipping_cost || 0)
  end
  
  before_save do |unit|
    # If unit is sold, returned, or retired, set its retire_date
    unit.retire_date = Date.today if ((["pending", "in_transit_from_supplier", "available"].include? unit.status_was) && (["sold", "returned", "retired"].include? unit.status))
  end
  
  after_create do
    self.update_counter_cache
  end
  
  # Reservation objects must call this method every time they change status, are create, or are deleted
  def update_counter_cache
    self.live_reservations_counter_cache = self.live_reservations.size
    self.scheduled_reservations_counter_cache = self.scheduled_reservations.size
    self.save
  end
end
