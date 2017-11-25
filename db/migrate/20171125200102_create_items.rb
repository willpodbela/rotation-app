class CreateItems < ActiveRecord::Migration[5.1]
  def change
    create_table :items do |t|
      t.string :title, :null => false
      t.text :description
      t.integer :quantity, :default => 0, :null => false
      t.string :image_url
      t.timestamps
    end
  end
end
