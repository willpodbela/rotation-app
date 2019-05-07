class FulfillmentController < ApplicationController
  def index
    @reservations = Reservation.where(status: [:scheduled, :processing, :active, :returned]).order(:status)
  end
end
