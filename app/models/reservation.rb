class Reservation < ApplicationRecord
  belongs_to :item
  belongs_to :user

  enum status: [ :scheduled, :sent, :active, :returned, :ended, :cancelled ]
end
