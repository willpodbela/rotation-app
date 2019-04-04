class Unit < ApplicationRecord
  belongs_to :item
  
  scope :available_for_rent, -> { where(status: [:in_transit_from_supplier, :active]) }
  
  enum size: [ :S, :M, :L, :XL ]
  enum status: [ :pending, :in_transit_from_supplier, :active, :sold, :returned, :retired ]
  
  before_save do |unit|
    # If unit is sold, returned, or retired, set its date_retired
    unit.date_retired = Date.today if ((["pending", "in_transit_from_supplier", "active"].include? unit.status_was) && (["sold", "returned", "retired"].include? unit.status))
  end
  
end
