class KpiController < ApplicationController
  before_action :slice_setup

  def index
    @visible_count = Item.visible.with_images.count
    @inventory = Queries::Inventory.new
    
    @penetration_hash = Item.visible
    .includes(:not_cancelled_reservations, :units)
    .group_by(&@slice_by.to_sym)
    
    # Sort groups by newest member item first
    @penetration_items = @penetration_hash.sort_by { |k, v| v.max_by(&:created_at).created_at }.reverse!
    
    # Compute penetration going back various points in time for the graph
    @graph_time_slices = [90, 60, 30, 15, 7]
    @graph_hash = @penetration_hash.map {|k,v| {name: k, data: (@graph_time_slices.map { |i| { -i => (v.sum {|e| e.cum_days_rented(Time.zone.now-i.day) }) * 100 / ((v.sum {|e| e.cum_days_units_in_service(Time.zone.now-i.day)}).to_f.nonzero? || 1)} }).reduce({}, :merge)}}
    
    @customer_sizes = Hash.new
    User.paying_customers.includes(:reservations).each do |u|
      res_sizes = u.reservations.map(&:size).compact
      size_freq = Hash[res_sizes.group_by{|x|x}.map{|k, v| [k, 1.0*v.size/res_sizes.length]}]
      @customer_sizes.merge!(size_freq) {|k, o, n| o + n}
    end
  end
  
  private
  
  def query_params
    params.permit(:slice_by)
  end
  
  def slice_setup
    @slice_options = ["title", "color", "category", "sub_category", "meta_category", "supplier_color"]
    @slice_by = @slice_options.include?(params[:slice_by]) ? params[:slice_by] : "category"
  end
   
end
