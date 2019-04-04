class AddNotesColumnToUnits < ActiveRecord::Migration[5.1]
  def change
    add_column :units, :notes, :string
  end
end
