class ReservationMailer < ActionMailer::Base
  layout 'mailer'
  
  before_action do
    @reservation = params[:reservation]
    @item = @reservation.item
    @user = @reservation.user
    @profile = @user.profile
  
    @to_address = "reservations@therotation.club"
    
    @subject = ENV["EMAIL_PREFIX"]
    @subject ||= ""
  end
  
  default to:       -> { 'reservations@therotation.club' },
          from:     -> { 'rotation-app@therotation.club' },
          subject:  -> { @subject }
  
  def reservation_created
    @subject += "Reservation #{@reservation.id}"
    mail    
  end
  
  def reservation_cancelled
    @subject += "Reservation #{@reservation.id}"
    mail  
  end
  
  def purchase_requested
    @subject += "Purchase Request by #{@user.email} for #{@item.subtitle}"
    mail    
  end
end
