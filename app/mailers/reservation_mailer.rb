class ReservationMailer < ActionMailer::Base
  default from: 'rails-application@therotation.club'
  layout 'mailer'
  
  before_action do
    @to_address = "support@therotation.club"
    
    @subject = ENV["EMAIL_SUBJ_PREFIX"]
    @subject ||= ""
  end
  
  def reservation_created(reservation)
    item = reservation.item
    user = reservation.user
    profile = user.profile
    
    body = "A new reservation has been created.\n\n"
    body += "<ul>Item</ul>\n"
    body += "ID: #{item.id}\n"
    body += "Brand: #{item.title}\n"
    body += "Name: #{item.subtitle}\n\n"
    if item.company_owned?
      body += "Item is company owned."
    else
      body += "<a href='#{item.buyURL}'>Purchase Item</a>"
    end
    
    body += "\n\n<ul>User</ul>\n"
    body += "ID: #{user.id}\n"
    body += "Email: #{user.email}\n"
    body += "Address Line 1: #{profile.address_line_one}\n"
    body += "Address Line 2: #{profile.address_line_two}\n"
    body += "Address City: #{profile.address_city}\n"
    body += "Address State: #{profile.address_state}\n"
    body += "Address Zip: #{profile.address_zip}"
    
    @subject += "New Reservation!"
    
    mail(to: @to_address, body: body, content_type: "text/html", subject: @subject)
  end
  
  def reservation_destroyed(reservation)
  
  end
end
