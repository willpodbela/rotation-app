module Queries
  class Inventory
    def initialize
      available_sizes = Unit.group(:item_id, :size).count
      @total_count_by_item = Unit.group(:item_id).count
      @sizes = Hash.new

      available_sizes.each do |key, value|
        @sizes[key[0]] = Hash.new if @sizes[key[0]].nil?
        @sizes[key[0]][key[1]] = value
      end
    end

    def size_availability(item)
      @sizes[item.id] || Hash.new
    end

    def num_availabile(item, size)
      @sizes[item.id][size] || 0
    end
    
    def total_available(item)
      @total_count_by_item[item.id] || 0
    end
  end
end