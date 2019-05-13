class FulfillmentController < AdminBaseController
  def index
    @reservations = Reservation.where(status: [:scheduled, :processing, :active, :returned]).order("#{sort_column} #{sort_direction}")
  end
  
  private
  
  def sortable_columns
    ["status", "created_at"]
  end
  
end
