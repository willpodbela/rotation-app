class AddRfidTagIdToUnits < ActiveRecord::Migration[5.1]
  def change
    add_column :units, :rfid_tag_id, :string
  end
end
