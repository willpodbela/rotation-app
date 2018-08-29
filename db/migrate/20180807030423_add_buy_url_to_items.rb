class AddBuyUrlToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :buyURL, :string
  end
end
