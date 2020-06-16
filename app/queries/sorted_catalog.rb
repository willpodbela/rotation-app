module Queries
  class SortedCatalog
    attr_accessor :buckets, :all
  
    def initialize
      # 1. Start with only visible items that have images, includes associations needed for sorting
      items = Item.visible.with_images.includes(:not_cancelled_reservations, :units)
      
      # 2. @buckets items by sub_category relevancy based on time of year and other consumer macro trends.
      # NOTE: Last time this was updated, we were focused on the warm June weather and the 
      # idea that house partys would be the main social event post-COVID
      
      most_relevant_cats = [ "T-Shirts", "Tank Tops", "V-Necks", "Henleys", "Sweatpants", "Hoodies", "Polos", "Button-Downs", "Button-downs", "Longsleeves", "Rings", "Necklaces", "Bracelets", "Trousers", "Crewnecks", "Track Pants", "Track Jackets" ]
      semi_relevant_cats = [ "Denim Jackets", "Bombers", "Zipups", "Jackets", "Vests", "Cargo Pants" ]
      not_relevant_cats = [ "Knits", "Leather Jackets", "Coats", "Peacoats", "Trench Coats", "Fur & Shearling", "Cardigans", "Puffers", "Turtlenecks", "Down" ]
      
      @buckets = items.group_by {|i| [most_relevant_cats, semi_relevant_cats, not_relevant_cats].index{|aa| aa.include?(i.sub_category)}}
      
      # 3. Create two versions of each bucket, ordered by utilization (proxy for popularity) and date (proxy for newness)
      
      @buckets_by_popularity = Hash.new()
      @buckets_by_date = Hash.new()
      
      @buckets.each do |k, list|
        @buckets_by_popularity[k] = list.sort {|b, a| (a.cum_days_rented.to_f / a.cum_days_units_in_service) <=> (b.cum_days_rented.to_f / b.cum_days_units_in_service)}
        @buckets_by_date[k] = list.sort_by(&:created_at).reverse
      end
      
      # 4. Combine the two strictly ordered @buckets to create a composite bucket with both popular and new items at the top.
      
      # In this implementation, we select 3 of every 8 items from the newest and 5 of every 8 items from the most popular.
      sel_order = [:pop, :pop, :pop, :new, :pop, :new, :new, :pop]
      
      @buckets.each do |k, list|
        i_popular = 0
        i_date = 0
        composite_bucket = []
        
        while composite_bucket.count < list.count
          sel_from = sel_order[composite_bucket.count % 8]
          
          if sel_from == :pop
            next_item = @buckets_by_popularity[k][i_popular]
            i_popular = i_popular + 1
          else
            next_item = @buckets_by_date[k][i_date]
            i_date = i_date + 1
          end
          
          if !composite_bucket.include?(next_item)
            composite_bucket.push(next_item)
          end
        end
        
        @buckets[k] = composite_bucket
      end
      
      
      @all = []
      @buckets.keys.compact.sort.each do |key|
        @all += @buckets[key]
      end
      @all += @buckets[nil] if @buckets[nil]
    end
  end
end