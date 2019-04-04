class CreateUnits < ActiveRecord::Migration[5.1]
  def change
    create_table :units do |t|
      t.integer :item_id, null: false
      t.integer :size, null: false
      t.string :supplier
      t.string :supplier_order_id
      t.decimal :cost
      t.date :order_date
      t.integer :status, default: 0, null: false
      
      t.timestamps
    end
  end
end
