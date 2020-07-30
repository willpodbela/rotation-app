class ShipmentsController < ApplicationController
  before_action :enforce_access_control_admin!

  def index
    @shipments = Shipment.order(created_at: :desc).includes(:reservations)
  end

  def show
    @shipment = Shipment.find(params[:id])
  end
    
  def create
    reservations = Reservation.find(params[:reservation_ids])
    
    reservations.each do |r|
      if r.user_id != reservations.first.user_id
        flash[:alert] = "Reservations must all be from the same user."
        redirect_to fulfillment_index_url and return
      end
    end

    user = reservations.first.user
    profile = user.profile

    require 'shippo'
    Shippo::API.token = 'shippo_test_44f00506d94b385f0888db1f8dc48ca058f436d8'
    rotation_address = "177579278ffd4c04b1eb693ae5bd49ef"
    
    customer_address = {
      :name => profile.first_name + " " + profile.last_name,
      :street1 => profile.address_line_one,
      :street2 => profile.address_line_two,
      :city => profile.address_city,
      :state => profile.address_state,
      :zip => profile.address_zip,
      :country => "US",
      :email => user.email
    }

    # can also just be sent as a parcel object_id
    # parcel will be picked based on the size of @reservations
    parcel = {
      :length => 5,
      :width => 1,
      :height => 5.555,
      :distance_unit => :cm,
      :weight => 2,
      :mass_unit => :lb
    }

    to_shipment = {
        :address_from => rotation_address,
        :address_to => customer_address,
        :parcels => parcel
    }
    return_shipment = {
        :address_from => rotation_address,
        :address_to => customer_address,
        :parcels => parcel,
        :extra => {:is_return => true}
    }

    to_transaction = Shippo::Transaction.create(
    :shipment => to_shipment,
    :carrier_account => "fc4cd0280ea04b2b9a17e7f7587efded",
    :servicelevel_token => "usps_priority"
    )
    return_transaction = Shippo::Transaction.create(
    :shipment => return_shipment,
    :carrier_account => "fc4cd0280ea04b2b9a17e7f7587efded",
    :servicelevel_token => "usps_priority"
    )

    # catches carrier errors, ex: invalid address
    if to_transaction.status == "ERROR"
      flash[:alert] = to_transaction.messages.first.text
      redirect_to fulfillment_index_url and return
    end

    to_shipment = Shipment.new(
      :shippo_id => to_transaction.object.id, 
      :direction => "outbound", 
      :label_link => to_transaction.label_url, 
      :tracking_link => to_transaction.tracking_url_provider
    )
    return_shipment = Shipment.new(
      :shippo_id => return_transaction.object.id, 
      :direction => "return", 
      :label_link => return_transaction.label_url, 
      :tracking_link => return_transaction.tracking_url_provider
    )

    to_shipment.reservations = reservations
    return_shipment.reservations = reservations

    if to_shipment.save && return_shipment.save
      flash[:notice] = "Shipment created successfully."
    else
      flash[:alert] = "Could not create shipment."
    end
    redirect_to fulfillment_index_url
  end

  # sends refund request
  def update
    @shipment = Shipment.find(params[:id])

    require 'shippo'
    Shippo::API.token = 'shippo_test_44f00506d94b385f0888db1f8dc48ca058f436d8'

    refund = Shippo::Refund.create(
      :transaction => @shipment.shippo_id, 
      :async => false
    )

    if refund.status != "ERROR" && @shipment.update_attribute(:refund_requested, Time.now.to_datetime)
      flash[:notice] = "Refund successfully requested."
    else
      flash[:alert] = "Refund request unsuccessful."
    end
    redirect_back(fallback_location: shipments_path)
  end
end
