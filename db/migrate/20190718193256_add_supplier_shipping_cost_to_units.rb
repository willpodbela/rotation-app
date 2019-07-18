class AddSupplierShippingCostToUnits < ActiveRecord::Migration[5.1]
  def change
    add_column :units, :supplier_shipping_cost, :decimal
  end
end
