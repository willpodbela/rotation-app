class ReservationMailer < ActionMailer::Base
  default from: 'rotation-app@therotation.club'
  layout 'mailer'
  
  before_action do
    @to_address = "support@therotation.club"
    
    @subject = ENV["EMAIL_PREFIX"]
    @subject ||= ""
  end
  
  def reservation_created(reservation)
    @item = reservation.item
    @user = reservation.user
    @profile = @user.profile
    
    @subject += "Reservation #{reservation.id}"
    
    mail(to: @to_address, subject: @subject)
  end
  
  def reservation_cancelled(reservation)
    @reservation = reservation
    @item = reservation.item
    @user = reservation.user
    @profile = @user.profile
    
    @subject += "Reservation #{reservation.id}"
    
    mail(to: @to_address, subject: @subject)
  end
end
