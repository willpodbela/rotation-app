class KpiController < ApplicationController
  def index
    @inventory = Queries::Inventory.new
  end
end
