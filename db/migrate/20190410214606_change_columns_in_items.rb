class ChangeColumnsInItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :items, :quantity, :integer, :default => 0, :null => false
    remove_column :items, :company_owned, :boolean, :default => true, :null => false
    add_column :items, :virtual_qty, :integer, :default => 0, :null => false
  end
end
