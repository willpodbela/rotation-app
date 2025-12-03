# Configure Zeitwerk autoloading for the Queries namespace
Rails.autoloaders.main.push_dir("#{Rails.root}/app/queries", namespace: Queries)
