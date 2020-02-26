class KpiController < ApplicationController
  def index
    @visible_count = Item.visible.with_images.count
    @inventory = Queries::Inventory.new
    
    @slice_options = slice_options
    @slice_by = slice_by
    @penetration_items = Item.visible
    .includes(:not_cancelled_reservations, :units)
    .group_by(&slice_by.to_sym)
    
    @customer_sizes = Hash.new
    User.paying_customers.each do |u|
      res_sizes = u.reservations.map(&:size).compact
      size_freq = Hash[res_sizes.group_by{|x|x}.map{|k, v| [k, 1.0*v.size/res_sizes.length]}]
      @customer_sizes.merge!(size_freq) {|k, o, n| o + n}
    end
  end
  
  private
  
  def query_params
    params.permit(:slice_by)
  end
  
  def slice_by
    slice_options.include?(params[:slice_by]) ? params[:slice_by] : "category"
  end
  
  def slice_options
    ["title", "color", "category", "sub_category", "meta_category", "supplier_color"]
  end
  
end
