class CreateDevices < ActiveRecord::Migration[5.1]
  def change
    create_table :devices do |t|
      t.string  :token, :limit => 64, :null => false
      t.integer :user_id, :null => false
      
      t.timestamps
    end
    
    add_index(:devices, :token, :unique => true)
    add_index :devices, ["token", "user_id"]
  end
end
