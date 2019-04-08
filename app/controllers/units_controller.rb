class UnitsController < ApplicationController
  before_action :enforce_access_control_admin!
  before_action :set_item

  def index
    @units = Unit.where(query_params).order(:status, :order_date)
    @avg_cost = Unit.available_for_rent.average(:cost)
    @total_cost = Unit.available_for_rent.sum(:cost)
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
    if @unit.update_attributes(unit_params)
      # If save succeeds, redirect to the show action
      flash[:notice] = "Unit updated successfully."
      redirect_to(unit_path(@unit))
    else
      # If save fails, redisplay the form so user can fix problems
      render('edit')
    end
  end
  
  def destroy
    # TODO render 404.
  end
  
  private
  
  def unit_params
    params.require(:unit).permit(:item_id, :size, :supplier, :supplier_order_id, :cost, :order_date, :retire_date, :status, :notes)
  end
  
  def query_params
    params.permit(:item_id, :status)
  end
  
  def set_item
    @item = Item.find_by_id(params[:item_id]) 
  end
end
