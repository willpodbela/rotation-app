class ShippoUpdateMailer < ApplicationMailer
    default from: 'rotation-app@therotation.club'
    def shippo_update
        @shipment = params[:shipment]
        @user = @shipment.reservations.first.user
        @profile = @user.profile

        mail(to: "zayn@therotation.club", subject: "Shipment Update on Return Package")
    end
end
