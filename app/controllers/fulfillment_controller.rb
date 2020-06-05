class FulfillmentController < AdminBaseController
  before_action :enforce_access_control_admin!
  
  def index
    @reservations = Reservation
    .includes(:unit, :item, :user => [:current_valid_subscriptions, :profile])
    .where(status: [:scheduled, :processing, :active, :returned])
    .where(query_params)
    .order("#{sort_column} #{sort_direction}")
    
    @offline_units = Unit.offline
    .includes(:item)

    @users = User
    .includes(:profile, :not_cancelled_reservations)
    .where(profiles: {auto_pilot: true} )
    .where('users.id NOT IN (SELECT DISTINCT(user_id) FROM (SELECT  "reservations".* FROM "reservations" WHERE "reservations"."status" IN (0, 1, 2, 3) ) AS live_reservations)')
    
    # - User.joins(:live_reservations)

    # .where('id NOT IN (SELECT DISTINCT(users.id) FROM live_reservations)')

    # .joins(:live_reservations)
    # .group('users.id')
    # .having('count(live_reservations) = 0')

    # .left_joins(:live_reservations)
    # .where( live_reservations: { id: nil } )

  end
  
  private
  
  def sortable_columns
    ["status", "created_at", "unit_id", "units.notes", "users.email", "id", "size", "items.title"]
  end
  
  def query_params
    params.permit(:status)
  end
  
end
