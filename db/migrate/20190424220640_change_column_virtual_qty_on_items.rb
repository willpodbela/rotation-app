class ChangeColumnVirtualQtyOnItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :items, :virtual_qty, :integer, :default => 0, :null => false
    add_column :items, :virtual_qty, :integer, :default => 1, :null => false
  end
end
