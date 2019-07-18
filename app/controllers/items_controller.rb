class ItemsController < ApplicationController
  before_action :enforce_access_control_admin!

  def index
    @items = Item
    .includes(:not_cancelled_reservations)
    .where(query_params)
    
    @owned_inventory_counts = Unit.owned.group(:item_id, :size).count
  end
  
  def image_matching_tool
    @item = Item.visible.without_images.with_alternate_image_options.order("RANDOM()").first
    render :edit
  end

  def show
    @item = Item.find(params[:id])
  end

  def new
    @item = Item.new()
  end
  
  def create
    # Instantiate a new object using form parameters
    @item = Item.new(item_params)
    # Save the object
    if @item.save
      # If save succeeds, redirect to the index action
      flash[:notice] = "Subject created successfully."
      redirect_to()
    else
      # If save fails, redisplay the form so user can fix problems
      render('new')
    end
  end

  def edit
    @item = Item.find(params[:id])
  end
  
  def update
    # Find a new object using form parameters
    @item = Item.find(params[:id])
    # Update the object
    if @item.update_attributes(item_params)
      # If save succeeds, redirect to the show action
      flash[:notice] = "Item updated successfully."
      redirect_to(item_path(@item))
    else
      # If save fails, redisplay the form so user can fix problems
      render('edit')
    end
  end
  
  def destroy
    @item = Item.find(params[:id])
    @item.destroy
    flash[:notice] = "Item '#{@item.title}' destroyed successfully."
    redirect_to(items_path)
  end
  
  private
  
  def item_params
    params.require(:item).permit(:title, :description, :image_url, :image, :subtitle, :retail_value, :color, :hidden, :image_remote_url, :virtual_qty)
  end
  
  def query_params
    params.permit(:hidden, :company_owned)
  end
end