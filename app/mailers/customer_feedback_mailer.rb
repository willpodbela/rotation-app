class CustomerFeedbackMailer < ApplicationMailer
  default from: 'Zach Podbela <zach@therotation.club>'
  layout 'customer_feedback_mailer'
  
  after_action :dont_send_duplicates
  
  def founder_hello
    @user = params[:user]
    @subject = 'The Rotation — A personal hello from the founder'
    mail(to: @user.email, subject: @subject)
  end
  
  def waitlist_thank_you
    @user = params[:user]
    @subject = 'The Rotation — Note from the Founders'
    mail(to: @user.email, subject: @subject)
  end
  
  def self.preferred_time
    Time.zone.tomorrow.at_beginning_of_day.advance(hours: 10, minutes: rand(60))
  end
  
  private
  
  def dont_send_duplicates
    if Communication.find_by(email: @user.email, message_name: @subject)
      # This is a duplicate, do not send
      mail.perform_deliveries = false
    else
      # We have not sent this message yet, record it in the database to avoid future dups
      Communication.create(email: @user.email, message_name: @subject)
    end
  end
end
