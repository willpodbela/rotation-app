module Queries
  class Inventory
    def initialize
      # Instance variables that need to be computed:
      @total_count_by_item = Hash.new     # For use with legacy versions (no sizing), 2D Map keys=[item_id][size] to integer
      @sizes = Hash.new                   # For use with new versions, Maps key=item_id to integer
      
      # 1. For each item, compute qty by size that we actually own (non-virtual)
      available_sizes = Unit.available_for_rent.group(:item_id, :size).count    # Maps key=[item_id, size] to integer
      
      # 2. For each reservation, determine if we can allocated real inventory. Based on 
      # that, determine qty of real vs qty of virtual inventory that will allocated for 
      # each item.
      real_inventory_allocated = Hash.new       # Maps key=[item_id, size] to integer
      virtual_inventory_allocated = Hash.new    # Maps key=item_id to integer
      
      total_unit_item_counts = Unit.group(:item_id).count  
      resourced_reservations = Reservation.live + Reservation.scheduled
      resourced_reservations.each do |reservation|
        size = reservation.size
        
        # NOTE: Short-term fix for size == nil, as there are some active reservations without sizes created by the legacy iOS application
        if size.nil?
          # First see if there is real inventory and allocate that, else just go with small and it should take away virtual inv
          if total_unit_item_counts[reservation.item_id] > 0:
            size = reservation.item.units.first.size 
          end
          size ||= :S
        end
              
        # See if there is any real inventory left in that size
        real_qty_left = (available_sizes[[reservation.item_id, reservation.size]] || 0) - (real_inventory_allocated[[reservation.item_id, reservation.size]] || 0)
        
        if real_qty_left > 0
          # There is real inventory that can be allocated to this reservation
          real_inventory_allocated[[reservation.item_id, reservation.size]] = (real_inventory_allocated[[reservation.item_id, reservation.size]] || 0) + 1
        else 
          # There is no real inventory that can be allocated to this reservation, assign virtual inventory
          virtual_inventory_allocated[reservation.item_id] = (virtual_inventory_allocated[reservation.item_id] || 0) + 1
        end
      end
      
      # 3. For each item, determine number available for rent at this moment in each size          
      Item.all.each do |item|
        # 3.a. Compute total qty of virtual inventory (allocated and unallocated)
        total_virtual_qty = item.virtual_qty - (total_unit_item_counts[item.id] || 0)
        total_virtual_qty = 0 if total_virtual_qty < 0
        
        # 3.b. Determine total (virtual+real) available for rent at this moment in each size
        @sizes[item.id] = Hash.new if @sizes[item.id].nil?
        
        allocated_virtual_qty = (virtual_inventory_allocated[item.id] || 0)
        cum_real_avail_qty = 0
        
        Unit.sizes.keys.each do |size|
          total_real_qty = (available_sizes[[item.id, size]] || 0)
          allocated_real_qty = (real_inventory_allocated[[item.id, size]] || 0)
          
          @sizes[item.id][size] = total_real_qty - allocated_real_qty + total_virtual_qty - allocated_virtual_qty
          cum_real_avail_qty += (total_real_qty - allocated_real_qty)
        end
        
        @total_count_by_item[item.id] = cum_real_avail_qty + total_virtual_qty - allocated_virtual_qty
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