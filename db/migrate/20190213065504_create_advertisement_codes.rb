class CreateAdvertisementCodes < ActiveRecord::Migration[5.1]
  def change
    create_table :advertisement_codes do |t|
      t.string :description, :null => false
      t.string :code, :null => false
    end
    add_index :advertisement_codes, :code, unique: true
  end
end
