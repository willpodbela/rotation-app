ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.

# Configure Zeitwerk to skip directories with explicit module namespacing
if defined?(Zeitwerk)
  Zeitwerk::Loader.for_gem.ignore("#{__dir__}/../app/queries")
  Zeitwerk::Loader.for_gem.ignore("#{__dir__}/../app/scripts")
  Zeitwerk::Loader.for_gem.ignore("#{__dir__}/../app/services")
end

