class KpiController < ApplicationController
  def index
    @visible_count = Item.visible.with_images.count
    @inventory = Queries::Inventory.new
    
    @customer_sizes = Hash.new
    User.paying_customers.each do |u|
      res_sizes = u.reservations.map(&:size).compact
      size_freq = Hash[res_sizes.group_by{|x|x}.map{|k, v| [k, 1.0*v.size/res_sizes.length]}]
      @customer_sizes.merge!(size_freq) {|k, o, n| o + n}
    end
  end
end
