class CreateShipments < ActiveRecord::Migration[5.1]
  def change
    create_table :shipments do |t|
      t.string :shippo_id, null:false
      t.string :direction, null:false
      t.string :label_link, null:false
      t.string :tracking_link, null:false
      t.datetime :refund_requested
      
      t.timestamps
    end
  end
end
