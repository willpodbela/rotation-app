ruby '3.2.9'

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rack-cors'

# Use a stable Rails 7.0 version
gem 'rails', '~> 7.0.8'

gem 'pg', '~> 1.5'
gem 'puma', '~> 6.0'

gem 'sassc-rails'  # use sassc instead of older sass-rails
gem 'uglifier', '>= 4.2.0'

gem 'coffee-rails', '~> 5.0'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.11'
gem 'kaminari'
gem 'chartkick'
gem 'airrecord'

gem 'devise', '~> 4.9'
gem 'aescrypt'

# Use ActiveStorage for file uploads instead of Paperclip if possible.
gem 'paperclip', '~> 6.0'

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
gem 'sidekiq', '~> 7.3'  # newer version that supports Ruby 3.3

gem 'jquery-rails'
gem 'bootstrap', '~> 5.3'
gem 'font-awesome-rails'
gem 'clipboard-rails'

group :development, :test do
  gem 'debug'
  gem 'capybara', '~> 3.40'
  gem 'selenium-webdriver', '~> 4.0'
  gem 'letter_opener_web'
end

group :development do
  gem 'web-console', '>= 4.2'
  gem 'listen', '~> 3.8'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.1'
end

gem 'tzinfo-data', platforms: [:windows]

gem 'shippo'
