class AddCustomCounterCacheToItems < ActiveRecord::Migration[5.1]
  def up
    add_column :items, :live_reservations_counter_cache, :integer
    add_column :items, :scheduled_reservations_counter_cache, :integer
    
    Item.find_each do |item|
      item.update_counter_cache
    end
  end
  
  def down
    remove_column :items, :live_reservations_counter_cache
    remove_column :items, :scheduled_reservations_counter_cache
  end
end
