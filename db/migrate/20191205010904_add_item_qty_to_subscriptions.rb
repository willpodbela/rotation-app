class AddItemQtyToSubscriptions < ActiveRecord::Migration[5.1]
  def change
    add_column :subscriptions, :item_qty, :integer, :null => false, :default => 2
    change_column_default :subscriptions, :item_qty, from: 2, to: nil
  end
end
