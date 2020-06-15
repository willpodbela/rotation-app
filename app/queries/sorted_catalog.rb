module Queries
  class SortedCatalog
    attr_accessor :buckets, :all
  
    def initialize
      # 1. Start with only visible items that have images, includes associations needed for sorting
      items = Item.visible.with_images.includes(:not_cancelled_reservations, :units)
      
      # 2. Buckets items by sub_category relevancy based on time of year and other consumer macro trends.
      # NOTE: Last time this was updated, we were focused on the warm June weather and the 
      # idea that house partys would be the main social event post-COVID
      
      most_relevant_cats = [ "T-Shirts", "Tank Tops", "V-Necks", "Henleys", "Sweatpants", "Hoodies", "Polos", "Button-downs", "Longsleeves", "Rings", "Necklaces", "Bracelets", "Trousers", "Crewnecks", "Track Pants", "Track Jackets" ]
      semi_relevant_cats = [ "Denim Jackets", "Bombers", "Zipups", "Jackets", "Vests", "Cargo Pants" ]
      not_relevant_cats = [ "Knits", "Leather Jackets", "Coats", "Peacoats", "Trench Coats", "Fur & Shearling", "Cardigans", "Puffers", "Turtlenecks", "Down" ]
      
      @buckets = items.group_by {|i| [most_relevant_cats, semi_relevant_cats, not_relevant_cats].index{|aa| aa.include?(i.sub_category)}}
      
      # 3. Within each bucket, order by utilization (proxy for popularity)
      
      @buckets.each do |k, list|
        @buckets[k] = list.sort {|b, a| (a.cum_days_rented.to_f / a.cum_days_units_in_service) <=> (b.cum_days_rented.to_f / b.cum_days_units_in_service)}
      end
      
      # 4. Compile final array of all items in order
      
      @all = []
      @buckets.keys.compact.sort.each do |key|
        @all += @buckets[key]
      end
      @all += @buckets[nil] if @buckets[nil]
    end
  end
end