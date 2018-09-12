# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

unless Rails.env.production?
  ENV['API_AUTH_NAME'] = "authname1"
  ENV['API_AUTH_PASSWORD'] = "password2"
  ENV['INSTAGRAM_ENABLED'] = "true"
  ENV['EMAIL_PREFIX'] = "LOCAL DEV: "
end