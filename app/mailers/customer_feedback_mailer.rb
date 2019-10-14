class CustomerFeedbackMailer < ApplicationMailer
  default from: 'zach@therotation.club'
  layout 'customer_feedback_mailer'
  
  def founder_hello
    @user = params[:user]
    mail(to: @user.email, subject: 'The Roation — A personal hello from the founder')
  end
  
  def self.preferred_time
    Time.zone.tomorrow.at_beginning_of_day.advance(hours: 10, minutes: rand(60))
  end
end
