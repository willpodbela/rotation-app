class ShippingConfirmationMailer < ApplicationMailer
    default from: 'The Rotation <support@therotation.club>'
    layout 'shipping_confirmation_mailer'

    before_action :common_setup
    after_action :dont_send_duplicates
    
    def shipping_confirmed
        puts "User reservations remaining = " + @user.reservations_remaining.to_s
        puts "User data = " + @user.email.to_s
        if @user.reservations_remaining == 0
            @subject = 'Your Rotation order made on ' + Time.now.strftime("%B %d") + ' is on its way.'
            mail(to: @user.email, subject: @subject)
        end
    end
    
    def dont_send_duplicates
        unless @user.nil? || @subject.nil?
            if Communication.find_by(email: @user.email, message_name: @subject)
            # This is a duplicate, do not send
            mail.perform_deliveries = false
            puts "Did not send, duplicate!"
            else
            # We have not sent this message yet, record it in the database to avoid future dups
            Communication.create(email: @user.email, message_name: @subject)
            puts "not a duplicate, sending!"
            end
        end
    end

    def common_setup
        @user = params[:user]
        # @greeting_name = (@user.profile.first_name || "there") rescue "there"
    end
end


# user function current_subscription