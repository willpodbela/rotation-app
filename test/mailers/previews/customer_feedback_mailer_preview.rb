# Preview all emails at http://localhost:3000/rails/mailers/customer_feedback_mailer
class CustomerFeedbackMailerPreview < ActionMailer::Preview
  def founder_hello
    CustomerFeedbackMailer.with(user: User.first).founder_hello
  end
  
  def product_market_fit
    CustomerFeedbackMailer.with(user: User.first).product_market_fit
  end
end
