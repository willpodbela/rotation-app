class ShippingConfirmationMailer < ApplicationMailer
    default from: 'The Rotation <support@therotation.club>'
    layout 'shipping_confirmation_mailer'

    before_action :common_setup
    after_action :dont_send_duplicates
    
    def shipping_confirmed
        if @user.reservations_remaining == 0
            @subject = 'Your Rotation order made on ' + Time.strftime("%B %d") + ' is on its way.'
            # Date included in subject for de-duping
        end
    
    def dont_send_duplicates
        unless @user.nil? || @subject.nil?
            if Communication.find_by(email: @user.email, message_name: @subject)
            # This is a duplicate, do not send
            mail.perform_deliveries = false
            else
            # We have not sent this message yet, record it in the database to avoid future dups
            Communication.create(email: @user.email, message_name: @subject)
            end
        end
    end

end


user function current_subscription