class Unit < ApplicationRecord
  belongs_to :item
  
  scope :available_for_rent, -> { where(status: [:in_transit_from_supplier, :active]) }
  
  enum size: [ :S, :M, :L, :XL ]
  enum status: [ :pending, :in_transit_from_supplier, :active, :sold, :returned ]
  
end
