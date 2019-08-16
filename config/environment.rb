# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

unless Rails.env.production?
  ENV['INSTAGRAM_ENABLED'] = "true"
  ENV['EMAIL_PREFIX'] = "LOCAL DEV: "
  ENV['STRIPE_PLAN_ID'] = "plan_DmpGqUGCX1SpsS"
  ENV['MAIL_CHIMP_API_KEY'] = "a128a2f0edefa01e9526b94fddaee383-us3"
end