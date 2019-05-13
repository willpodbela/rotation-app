class FulfillmentController < AdminBaseController
  def index
    @reservations = Reservation
    .includes(:unit, :user, :item)
    .where(status: [:scheduled, :processing, :active, :returned])
    .order("#{sort_column} #{sort_direction}")
  end
  
  private
  
  def sortable_columns
    ["status", "created_at", "unit_id", "units.notes", "users.email", "id", "size", "items.title"]
  end
  
end
