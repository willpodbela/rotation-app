class KpiController < ApplicationController
  def index
    @visible_count = Item.visible.with_images.count
    @inventory = Queries::Inventory.new
  end
end
