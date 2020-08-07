class UnitsController < AdminBaseController
  before_action :enforce_access_control_admin!
  before_action :set_item

  def index
    @units = Unit
    .includes(:item)
    .where(query_params)
    .order("#{sort_column} #{sort_direction}")

    arr = Unit.available_for_rent.to_a
    arr_total_costs = arr.map(&:total_cost)
    @avg_cost = (arr_total_costs.empty?) ? 0 : (arr_total_costs.inject{ |sum, el| sum + el } / arr_total_costs.size)
    @total_cost = arr.sum(&:total_cost)
  end

  def show
    @unit = Unit.find(params[:id])
  end

  def new
    @unit = Unit.new(:item_id => @item_id)
  end

  def create
    # Instantiate a new object using form parameters
    @unit = Unit.new(unit_params)
    @unit.item = @item
    # Save the object
    if @unit.save
      # If save succeeds, redirect to the index action
      flash[:notice] = "Unit created successfully."
      redirect_to(item_units_path(@item))
    else
      # If save fails, redisplay the form so user can fix problems
      render('new')
    end
  end

  def edit
    @unit = Unit.find(params[:id])
  end

  def update
    # Find a new object using form parameters
    @unit = Unit.find(params[:id])
    # Update the object
    respond_to do |format|
      if @unit.update_attributes(unit_params)
        # If save succeeds, redirect to the show action
        format.html { redirect_to @unit, notice: 'Unit updated successfully.' }
        format.js
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { head :no_content }
      end
    end
  end

  def destroy
    # TODO render 404.
  end
  
  def edit_multiple
    @units = Unit.find(params[:unit_ids])
  end
  
  def update_multiple
    @units = Unit.find(params[:unit_ids])
    @units.each do |unit|
      unit.update_attributes!(unit_params.reject { |k,v| v.blank? })
    end
    flash[:notice] = "Updated units!"
    redirect_to units_path
  end

  def returned
    @unit = Unit.find(params[:id])
    
    if @unit.live_reservations.count == 1
      r = @unit.live_reservations.first
      r.status = :ended
      unless r.save
        # TODO: Log error, could not save
      end
    else
      # TODO: Log error, there were either multiple or no active reservations for this unit
    end
    
    @unit.status = :offline
    respond_to do |format|
      if @unit.save
        # If save succeeds, redirect to the show action
        format.html { redirect_to @unit, notice: 'Unit updated successfully.' }
        format.js
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { head :no_content }
      end
    end
  end

  private

  def unit_params
    params.require(:unit).permit(:item_id, :size, :supplier, :supplier_order_id, :cost, :supplier_shipping_cost, :order_date, :retire_date, :status, :notes)
  end

  def query_params
    params.permit(:item_id, :status, :size, :supplier)
  end

  def set_item
    @item = Item.find_by_id(params[:item_id])
  end

  def sortable_columns
    ["size", "status", "supplier", "supplier_order_id", "order_date", "retire_date", "cost", "supplier_shipping_cost", "notes", "items.title"]
  end
end
