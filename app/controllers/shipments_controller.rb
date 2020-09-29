class ShipmentsController < AdminBaseController
  before_action :enforce_access_control_admin!

  def index
    @shipments = Shipment
    .includes(:reservations)
    .where(query_params)
    .order("#{sort_column} #{sort_direction}")

    @filter = query_params
  end

  def show
    @shipment = Shipment.find(params[:id])
  end
    
  def create
    ids = params[:reservation_ids_input].split(',')
    reservations = Reservation.find(ids)
    weight = params[:weight]

    if weight.empty?
      flash[:alert] = "Please enter weight."
      redirect_to fulfillment_index_url and return
    end
    reservations.each do |r|
      if r.user_id != reservations.first.user_id
        flash[:alert] = "Reservations must all be from the same user."
        redirect_to fulfillment_index_url and return
      end
    end

    user = reservations.first.user
    profile = user.profile

    require 'shippo'
    Shippo::API.token = ENV["SHIPPO_API_KEY"]
    rotation_address = ENV["SHIPPO_ROTATION_ADDRESS_ID"]
    
    customer_address = {
      :name => profile.full_name,
      :street1 => profile.address_line_one,
      :street2 => profile.address_line_two,
      :city => profile.address_city,
      :state => profile.address_state,
      :zip => profile.address_zip,
      :country => "US",
      :email => user.email
    }

    parcel = {
      :length => 13.3,
      :width => 11.5,
      :height => 2.4,
      :distance_unit => :in,
      :weight => weight,
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
      :package_direction => "outbound", 
      :label_link => to_transaction.label_url, 
      :tracking_link => to_transaction.tracking_url_provider,
      :tracking_number => to_transaction.tracking_number,
      :status => to_transaction.tracking_status,
      :reservations => reservations
    )
    return_shipment = Shipment.new(
      :shippo_id => return_transaction.object.id, 
      :package_direction => "return", 
      :label_link => return_transaction.label_url, 
      :tracking_link => return_transaction.tracking_url_provider,
      :tracking_number => return_transaction.tracking_number,
      :status => return_transaction.tracking_status,
      :reservations => reservations
    )

    if to_shipment.save && return_shipment.save
      flash[:notice] = "Shipment created successfully."
    else
      flash[:alert] = to_shipment.errors.full_messages
    end
    redirect_to fulfillment_index_url
  end

  # sends refund request
  def update
    @shipment = Shipment.find(params[:id])

    require 'shippo'
    Shippo::API.token = ENV["SHIPPO_API_KEY"]

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

  private
  def query_params
    params.permit(:package_direction).delete_if do |key, val|
      key == 'package_direction' && val == "all"
    end
  end

  def sortable_columns
    ["status"]
  end
end
