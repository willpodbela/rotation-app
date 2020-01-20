class CustomerFeedbackMailer < ApplicationMailer
  default from: 'Zach Podbela <zach@therotation.club>'
  layout 'customer_feedback_mailer'
  
  before_action :common_setup
  after_action :dont_send_duplicates
  
  def founder_hello
    @subject = 'The Rotation — A personal hello from the founder'
    mail(to: @user.email, subject: @subject)
  end
  
  def missed_conversion
    if @user.current_subscription.nil?
      @subject = 'The Rotation — Quick question'
      mail(to: @user.email, subject: @subject)
    end
  end
  
  def product_market_fit
    @subject = "The Rotation — We'd love to get your feedback"
    @survey_url = "https://zacharypodbela911528.typeform.com/to/J63gcg"
    mail(to: @user.email, subject: @subject)
  end
  
  def membership_purchased
    @subject = "The Rotation — Thank you for joining"
    @survey_url = "https://zacharypodbela911528.typeform.com/to/dyNqNv"
    mail(to: @user.email, subject: @subject)
  end
  
  def membership_cancelled
    unless @user.current_subscription.nil?
      if @user.current_subscription.status == 'canceled'
        @subject = "The Rotation — Sorry to see you go"
        mail(to: @user.email, subject: @subject)
      end
    end  
  end
  
  def heavy_user
    @subject = "The Rotation — Quick feedback request"
    mail(to: @user.email, subject: @subject)
  end
  
  def inactive_user
    # If user has no processing, active, or scheduled reservations created within the last 3 months
    if Reservation.where(user: @user, status: [:processing, :active, :scheduled]).where("created_at  > ?", 3.month.ago).count == 0
      @subject = "The Rotation — Checking in"
      mail(to: @user.email, subject: @subject)
    end
  end
  
  def waitlist_thank_you
    @subject = 'The Rotation — Note from the Founders'
    mail(to: @user.email, subject: @subject)
  end
  
  def self.preferred_time
    if Rails.env.production?
      Time.zone.tomorrow.at_beginning_of_day.advance(hours: 10, minutes: rand(60))
    else
      Time.zone.now.advance(seconds: 10)
    end
  end
  
  private
  
  def common_setup
    @user = params[:user]
    @greeting_name = (@user.profile.first_name || "there") rescue "there"
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
