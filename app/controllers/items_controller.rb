class ItemsController < AdminBaseController
  before_action :enforce_access_control_admin!
  before_action :set_options
  
  def index
    @items = Item
    .includes(:not_cancelled_reservations)
    .where(query_params)
    .order("#{sort_column} #{sort_direction}")
    
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
  
  def edit_multiple
    @items = Item.find(params[:item_ids])
  end
  
  def update_multiple
    @items = Item.find(params[:item_ids])
    @items.each do |item|
      item.update_attributes!(item_params.reject { |k,v| v.blank? })
    end
    flash[:notice] = "Updated items!"
    redirect_to items_path
  end
  
  private
  
  def item_params
    params.require(:item).permit(:title, :description, :image_url, :image, :subtitle, :retail_value, :color, :hidden, :image_remote_url, :virtual_qty, :landing_featured, :special, :category, :sub_category, :meta_category, :supplier_color)
  end
  
  def query_params
    params.permit(:hidden, :company_owned)
  end
  
  def sortable_columns
    ["id", "title", "subtitle", "hidden", "landing_featured", "category", "sub_category", "meta_category", "supplier_color", "color"]
  end
  
  def set_options
    @color_options = ["Black", "Beige", "White", "Grey", "Navy", "Denim", "Tie-Dye", "Brown", "Metallic", "Purple", "Blue", "Pink", "Green", "Yellow", "Orange", "Red", "Other"]
    @category_options = ["Jackets & Coats", "Tops", "Bottoms", "Shorts", "Sweaters", "Jewelry", "Jeans"]
    @sub_category_options = ["Puffers", "Bombers", "Coats", "Denim Jackets", "Down", "Fur & Shearling", "Jackets", "Leather Jackets", "Track Jackets", "Peacoats", "Trench Coats", "Vests", "Cargo Pants", "Leather Pants", "Track Pants", "Sweatpants", "Trousers", "Cardigans", "Knits", "Crewnecks", "Hoodies", "Zipups", "Sweatshirts", "Turtlenecks", "V-Necks", "Henleys", "Polos", "T-Shirts", "Button-downs", "Longsleeves", "Tank Tops", "Rings", "Necklaces", "Bracelets"]
  end
end