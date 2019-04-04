class AddDateRetiredColumnToUnits < ActiveRecord::Migration[5.1]
  def change
    add_column :units, :date_retired, :date
  end
end
