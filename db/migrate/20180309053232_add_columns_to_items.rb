class AddColumnsToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :subtitle, :string
    add_column :items, :retail_value, :string
  end
end
