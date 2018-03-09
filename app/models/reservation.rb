class Reservation < ApplicationRecord
  belongs_to :item
  belongs_to :user
  
  scope :for_user, ->(user) { where(user: user) }
  scope :now, -> { where('start_date < ?', Time.current).where('end_date > ?', Time.current) }
  scope :future, -> { where('start_date > ?', Time.current).where('end_date > ?', Time.current) }
  scope :past, -> { where('start_date < ?', Time.current).where('end_date < ?', Time.current) }
  
  #front_cycle_statuses are all statuses in the lifecycle from start until when the user decides to send the item back
  scope :front_cycle_statuses, -> { where(status: [:scheduled, :sent, :active]) }
  #live_statuses are all statuses except cancelled
  scope :live_statuses, -> { where(status: [:scheduled, :sent, :active, :returned, :ended]) }
  
  enum status: [ :scheduled, :sent, :active, :returned, :ended, :cancelled ]
end
