class AddSizeColumnToReservations < ActiveRecord::Migration[5.1]
  def change
    add_column :reservations, :size, :integer
  end
end
