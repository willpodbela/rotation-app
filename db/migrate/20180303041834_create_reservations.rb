class CreateReservations < ActiveRecord::Migration[5.1]
  def change
    create_table :reservations do |t|
      t.integer :item_id
      t.integer :user_id
    
      t.datetime :start_date
      t.datetime :end_date
      t.integer :status, :default => 0, :null => false

      t.timestamps
    end
    
    add_index :reservations, ["item_id", "user_id"]
  end
end
