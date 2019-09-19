class CreatePrelaunchUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :prelaunch_users do |t|
      t.string :email, null: false
      t.string  :invite_code
      t.integer :inviter_id
      t.string  :ip_address

      t.timestamps
    end
    add_index :prelaunch_users, :email, unique: true
    add_index :prelaunch_users, :ip_address
    add_index :prelaunch_users, :inviter_id
  end
end
