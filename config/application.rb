require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module RotationApp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.allow_unconfirmed_access_for = 100.years

    config.autoload_paths += [config.root.join('app')]
    
    # Enables CORS so that React front-end can fetch data from Rails
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*', headers: :any, methods: :any
      end
    end
    
    # Active Job's default adapter runs jobs with an in-process thread pool. It's 
    # well-suited for the development/test environments, since it doesn't require any
    # external infrastructure, but it's a poor fit for production since it drops pending 
    # jobs on restart. We're going to use Sidekiq as our Active Job adapter as it has a 
    # persistent backend.
    config.active_job.queue_adapter = :sidekiq
  end
end
