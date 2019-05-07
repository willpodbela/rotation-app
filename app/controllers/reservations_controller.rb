class ReservationsController < ApplicationController
  before_action :enforce_access_control_admin!
  before_action :set_item

  def index
    @reservations = Reservation.where(query_params).order(:status, :created_at)
    
    vals = []
    @reservations.to_a.each do |r|
      vals << (r.end_date - r.start_date)/1.day if r.ended?
    end
    @avg = vals.inject{ |sum, el| sum + el }.to_f / vals.size
  end

  def show
    @reservation = Reservation.find(params[:id])
  end

  def new
    @reservation = Reservation.new(:item_id => @item_id)
  end
  
  def create
    # Instantiate a new object using form parameters
    @reservation = Reservation.new(reservation_params)
    @reservation.item = @item
    # Save the object
    if @reservation.save
      # If save succeeds, redirect to the index action
      flash[:notice] = "Reservation created successfully."
      redirect_to(item_reservations_path(@item))
    else
      # If save fails, redisplay the form so user can fix problems
      render('new')
    end
  end

  def edit
    @reservation = Reservation.find(params[:id])
  end
  
  def update
    # Find a new object using form parameters
    @reservation = Reservation.find(params[:id])
    # Update the object
    respond_to do |format|
      if @reservation.update_attributes(reservation_params)
        # If save succeeds, redirect to the show action
        format.html { redirect_to @reservation, notice: 'Reservation updated successfully.' }
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
  
  private
  
  def reservation_params
    params.require(:reservation).permit(:start_date, :end_date, :user_id, :status, :size, :unit_id)
  end
  
  def query_params
    params.permit(:item_id, :status)
  end
  
  def set_item
    @item = Item.find_by_id(params[:item_id]) 
  end
end
