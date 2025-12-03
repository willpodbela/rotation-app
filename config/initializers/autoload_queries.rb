# Configure Zeitwerk to skip certain directories where classes use explicit module namespacing
# These will be lazy-loaded when first referenced
if defined?(Zeitwerk)
  loader = Rails.autoloaders.main
  loader.ignore("#{Rails.root}/app/queries")
  loader.ignore("#{Rails.root}/app/scripts")
  loader.ignore("#{Rails.root}/app/services")
end
