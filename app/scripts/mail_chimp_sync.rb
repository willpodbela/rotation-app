module Scripts
  class MailChimpSync
    require 'concurrent'
  
    def initialize
      @execution = []
    end
    attr_reader :execution
  
    def sync_all
      Concurrent::Future.execute do
        User.includes(:subscriptions, :profile, :referral_code, :advertisement_code, :current_valid_subscriptions).find_in_batches(batch_size: 200) do |group|
          group.each { |user| @execution << MailChimpService.sync_and_tag(user) }
        end
      end
      return "Sync Initialized. Call MailChimpSync.execution to query futures"
    end
  end
end