class CreateProfiles < ActiveRecord::Migration[5.1]
  def change
    create_table :profiles do |t|
      t.string :first_name
      t.string :last_name
      t.string :instagram_auth_token
      t.string :instagram_handle
      t.integer :instagram_follower_count
      t.integer :instagram_following_count
      t.integer :instagram_post_count
      t.datetime  :instagram_last_refresh
      t.string :address_line_one
      t.string :address_line_two
      t.string :address_city
      t.string :address_state
      t.string :address_zip
      t.integer :user_id, :null => false

      t.timestamps
    end
    
    add_index(:profiles, :user_id, :unique => true)
  end
end
