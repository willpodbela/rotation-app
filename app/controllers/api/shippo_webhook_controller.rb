require 'json'
 
module Api
  class ShippoWebhookController < ApplicationController
    protect_from_forgery with: :null_session
    skip_before_action :authenticate_user!
  
    def shippo
        response = JSON.parse(request.body.read)["data"]
        shipment = Shipment.where(shippo_id: response["object_id"]).first

        if shipment.nil?
            shipment = Shipment.new(
                :shippo_id => response["object_id"], 
                :package_direction => "unknown",
                :label_link => response["label_url"], 
                :tracking_link => response["tracking_url_provider"],
                :tracking_number => response["tracking_number"],
                :created_at => response["object_created"],
                :status => response["tracking_status"]
            )
            shipment.save
        end

        if shipment.status != response["tracking_status"]
            shipment.update_attribute(:status, response["tracking_status"])

            if shipment.package_direction == "return"
                ShippoUpdateMailer.with(shipment: shipment).shippo_update.deliver
            end
        end
        
        return head :ok
    end
  end
end