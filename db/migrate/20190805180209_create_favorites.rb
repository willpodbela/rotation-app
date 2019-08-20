class CreateFavorites < ActiveRecord::Migration[5.1]
  def change
    create_table :favorites do |t|
      t.integer :item_id
      t.integer :user_id
      t.index ["item_id", "user_id"], :unique => true
      t.timestamps
    end
  end
end
