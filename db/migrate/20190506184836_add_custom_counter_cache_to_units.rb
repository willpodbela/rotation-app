class AddCustomCounterCacheToUnits < ActiveRecord::Migration[5.1]
  def change
    add_column :units, :live_reservations_counter_cache, :integer, :default => 0, :null => false
    add_column :units, :scheduled_reservations_counter_cache, :integer, :default => 0, :null => false
  end
end
