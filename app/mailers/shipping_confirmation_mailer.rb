class ShippingConfirmationMailer < ApplicationMailer
    default from: 'The Rotation <support@therotation.club>'
    layout 'shipping_confirmation_mailer'

    before_action :common_setup
    after_action :dont_send_duplicates
    
    def shipping_confirmed
      if @user.reservations_remaining == 0
          @subject = 'Your Rotation order made on ' + Time.now.strftime("%B %d") + ' is on its way.'
          @title = "Your Rotation Order Has Shipped"
          @preview = "Your order is being packaged by our operations staff and will be on its way to you soon. Detailed tracking information will be sent over shortly in a separate email."
          mail(to: @user.email, subject: @subject)
      end
    end
    
    def time_to_rotate # (Customer returned item -> Reservation ended)
      @subject = '// Time to Rotate // ' + Time.now.strftime("%B %d")
      @title = "Your Rotation Has Been Recieved"
      @preview = "We’ve received your Rotation! Feel free to choose new items in the app."
      mail(to: @user.email, subject: @subject)
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

    def common_setup
        @user = params[:user]
    end
end