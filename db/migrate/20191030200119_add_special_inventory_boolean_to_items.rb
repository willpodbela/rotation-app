class AddSpecialInventoryBooleanToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :special, :boolean, :null => false, :default => false
  end
end
