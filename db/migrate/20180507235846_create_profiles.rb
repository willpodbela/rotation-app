class CreateProfiles < ActiveRecord::Migration[5.1]
  def change
    create_table :profiles do |t|
      t.string :first_name
      t.string :last_name
      t.string :instagram_auth_token
      t.string :instagram_handle
      t.int :instagram_follower_count
      t.int :instagram_following_count
      t.int :instagram_post_count
      t.string :address_line_one
      t.string :address_line_two
      t.string :address_city
      t.string :address_state
      t.string :address_zip
      t.int :user_id, :null => false

      t.timestamps
    end
    
    add_index(:profiles, :user_id, :unique => true)
  end
end
