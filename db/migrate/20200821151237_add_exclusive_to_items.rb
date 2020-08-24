class AddExclusiveToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :exclusive, :boolean, :null => false, :default => false
  end
end
