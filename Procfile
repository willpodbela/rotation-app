web: bundle exec rails server -p ${PORT:-3000}
release: rake db:migrate
mailerworker: bundle exec sidekiq -q mailers -c 2