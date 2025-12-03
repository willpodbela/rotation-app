# Configure Zeitwerk to skip autoloading the queries directory since those classes use explicit module namespacing
# They will be lazy-loaded when first referenced
if defined?(Zeitwerk)
  loader = Rails.autoloaders.main
  loader.ignore("#{Rails.root}/app/queries")
end
