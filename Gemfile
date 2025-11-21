ruby '3.1.6'

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rack-cors'

# Use a stable Rails 6.1 version
gem 'rails', '~> 6.1.7', '>= 6.1.7.10'

gem 'pg', '~> 1.5'
gem 'puma', '~> 5.0'

gem 'sassc-rails'  # use sassc instead of older sass-rails
gem 'uglifier', '>= 4.2.0'

gem 'coffee-rails', '~> 5.0'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.11'
gem 'kaminari'
gem 'chartkick'
gem 'airrecord'

gem 'devise', '~> 4.8'
gem 'aescrypt'

# Use ActiveStorage for file uploads instead of Paperclip if possible.
gem 'paperclip', '~> 5.3'

# Use modular AWS SDK
gem 'aws-sdk-s3', '~> 1.0'

gem 'dotenv-rails'
gem 'stripe'
gem 'http'
gem 'houston'
gem 'browser'

# Use a valid Gibbon version
gem 'gibbon', '~> 3.5'

gem 'concurrent-ruby', require: 'concurrent'
gem 'sidekiq', '~> 7.0'  # newer version that supports Ruby 3.2

gem 'jquery-rails'
gem 'less-rails-bootstrap'
gem 'font-awesome-rails'
gem 'jquery-easing-rails'
gem 'clipboard-rails'

group :development, :test do
  gem 'debug'
  gem 'capybara', '~> 3.4'
  gem 'selenium-webdriver'
  gem 'letter_opener_web'
end

group :development do
  gem 'web-console', '>= 4.2'
  gem 'listen', '~> 3.7'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0'
end

gem 'tzinfo-data', platforms: [:windows]

gem 'shippo'
