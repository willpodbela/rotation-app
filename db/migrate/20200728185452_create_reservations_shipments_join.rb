class CreateReservationsShipmentsJoin < ActiveRecord::Migration[5.1]
  def change
    create_table :reservations_shipments, :id => false do |t|
      t.integer "reservation_id"
      t.integer "shipment_id"
    end
    add_index("reservations_shipments", ["reservation_id", "shipment_id"])
  end
end
