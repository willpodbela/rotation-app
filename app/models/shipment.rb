class Shipment < ApplicationRecord
    has_and_belongs_to_many :reservations
    
    after_create do |shipment|
        # We'll use Active Record Callbacks to send fulfillment notification emails to the team
        ShippingConfirmationMailer.with(shipment: shipment).shipment_created.deliver
    end
end
