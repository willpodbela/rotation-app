class RenameShipmentDirectionToPackageDirection < ActiveRecord::Migration[5.1]
  def change
    rename_column :shipments, :direction, :package_direction
  end
end
