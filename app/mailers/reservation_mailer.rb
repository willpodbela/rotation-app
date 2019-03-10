class ReservationMailer < ActionMailer::Base
  layout 'mailer'
  
  before_action do
    @reservation = params[:reservation]
    @item = @reservation.item
    @user = @reservation.user
    @profile = @user.profile
  
    @to_address = "support@therotation.club"
    
    @subject = ENV["EMAIL_PREFIX"]
    @subject ||= ""
    @subject += "Reservation #{@reservation.id}"
  end
  
  default to:       -> { 'support@therotation.club' },
          from:     -> { 'rotation-app@therotation.club' },
          subject:  -> { @subject }
  
  def reservation_created
    mail    
  end
  
  def reservation_cancelled
    mail  
  end
  
  def purchase_requested
    mail    
  end
end
