class Reservation < ApplicationRecord
  belongs_to :item
  belongs_to :user
  
  scope :for_user, ->(user) { where(user: user) }
  scope :now, -> { where('start_date <= ?', Date.today).where('end_date >= ?', Date.today) }
  scope :future, -> { where('start_date >= ?', Date.today).where('end_date > ?', Date.today) }
  scope :past, -> { where('start_date < ?', Date.today).where('end_date <= ?', Date.today) }
  scope :next_period, -> { where('start_date <= ?', Reservation.next_reservation_period[:start_date]).where('end_date >= ?', Reservation.next_reservation_period[:end_date]) }
  
  #front_cycle statuses are all statuses in the lifecycle from start until when the user decides to send the item back
  scope :front_cycle, -> { where(status: [:scheduled, :sent, :active]) }
  #live statuses are all statuses except cancelled
  scope :live, -> { where(status: [:scheduled, :sent, :active, :returned, :ended]) }
  
  enum status: [ :scheduled, :sent, :active, :returned, :ended, :cancelled ]
  
  # NOTE: (#BETA) Very specific to the 2-week cycles and reservation restrictions of the beta. 
  # This function returns the date range for the next two week reservation period. 
  # RETURNS:     { start_date => 'yyyy-mm-dd', end_date => 'yyyy-mm-dd' }
  # We will probably want to deprecate later.
  def self.next_reservation_period
    start_date = Date.today
    start_date += 1 + ((3-start_date.wday) % 7)
    if start_date.cweek % 2 == 0
      start_date += 1 + ((3-start_date.wday) % 7)
    end
  
    end_date = start_date
    end_date += 1 + ((6-end_date.wday) % 7)
    end_date += 1 + ((6-end_date.wday) % 7)
  
    { :start_date => start_date, :end_date => end_date }
  end
  
  
  # We'll use Active Record Callbacks to send fulfillment notification emails to the team
  after_create do |reservation|
    ReservationMailer.with(reservation: reservation).reservation_created.deliver
  end
  
  after_save do |reservation|
    ReservationMailer.with(reservation: reservation).reservation_cancelled(reservation).deliver if reservation.cancelled?
  end
end
