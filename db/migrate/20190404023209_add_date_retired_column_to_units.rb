class AddDateRetiredColumnToUnits < ActiveRecord::Migration[5.1]
  def change
    add_column :units, :retire_date, :date
  end
end
