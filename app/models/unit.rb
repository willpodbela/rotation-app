class Unit < ApplicationRecord
  belongs_to :item
  
  enum size: [ :S, :M, :L, :XL ]
  enum status: [ :pending, :in_transit_from_supplier, :active, :sold, :returned ]
  
end
