class AddColumnsToItem < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :company_owned, :boolean, :default => true, :null => false
    add_column :items, :last_seen, :datetime
  end
end
