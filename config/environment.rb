# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

unless Rails.env.production?
  ENV['API_AUTH_NAME'] = "authname1"
  ENV['API_AUTH_PASSWORD'] = "password2"
  ENV['INSTAGRAM_ENABLED'] = "true"
  ENV['PRICING_SECTION_ENABLED'] = "false"
  ENV['EMAIL_PREFIX'] = "LOCAL DEV: "
  ENV['STRIPE_PLAN_ID'] = "plan_GIjHEOiSDYaRzH"
  ENV['MAIL_CHIMP_API_KEY'] = "a128a2f0edefa01e9526b94fddaee383-us3"
  ENV['WAREHOUSE_API_AUTH_NAME'] = "authname1"
  ENV['WAREHOUSE_API_AUTH_PASSWORD'] = "password2"
  ENV['SHIPPO_API_KEY'] = "shippo_test_44f00506d94b385f0888db1f8dc48ca058f436d8"
  ENV['SHIPPO_ROTATION_ADDRESS_ID'] = "177579278ffd4c04b1eb693ae5bd49ef"
end