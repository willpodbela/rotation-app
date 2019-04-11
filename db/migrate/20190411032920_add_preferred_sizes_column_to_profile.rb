class AddPreferredSizesColumnToProfile < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :preferred_sizes, :integer, array: true, default: []
  end
end
