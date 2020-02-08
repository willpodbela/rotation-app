class AddDetailsToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :category, :string
    add_column :items, :sub_category, :string
    add_column :items, :meta_category, :string
    add_column :items, :supplier_color, :string
  end
end
