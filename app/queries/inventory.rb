module Queries
  class Inventory
    def initialize
      available_sizes = Unit.group(:item_id, :size).count
      total_item_counts = Unit.group(:item_id).count
      
      @total_count_by_item = Hash.new
      @sizes = Hash.new
      
      Item.all.each do |item|
        @sizes[item.id] = Hash.new if @sizes[item.id].nil?
        
        virtual_add = item.virtual_qty - (total_item_counts[item.id] || 0)
        virtual_add = 0 if virtual_add < 0
        
        Unit.sizes.keys.each do |size|
          val = (available_sizes[[item.id, size]] || 0) + virtual_add
          @sizes[item.id][size] = val
        end
        
        @total_count_by_item[item.id] = (total_item_counts[item.id] || 0) + virtual_add
      end
    end

    def size_availability(item)
      @sizes[item.id] || Hash.new
    end

    def num_available(item, size)
      @sizes[item.id][size] || 0
    end
    
    def total_available(item)
      @total_count_by_item[item.id] || 0
    end
  end
end