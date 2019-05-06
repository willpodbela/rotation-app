class FulfillmentController < ApplicationController
  def index
    @outbound_reservations = Reservation.where(status: [:scheduled, :processing]).order(:status)
    @active_reservations = Reservation.where(status: [:active, :returned]).order(:status)
  end
end
