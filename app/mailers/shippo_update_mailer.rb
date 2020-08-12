class ShippoUpdateMailer < ApplicationMailer
    default to:   -> { 'zayn@therotation.club' },
            from: -> { 'rotation-app@therotation.club' }

    before_action do 
        @shipment = params[:shipment]
    end

    def shippo_return_update
        @user = @shipment.reservations.first.user
        @profile = @user.profile

        mail(subject: "Shipment Update on Return Package")
    end

    def shippo_unknown_update
        mail(subject: "Shipment Update on Unknown Package")
    end
end
