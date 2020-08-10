class AddStatusToShipments < ActiveRecord::Migration[5.1]
  def change
    add_column :shipments, :status, :string, :null => false
  end
end
