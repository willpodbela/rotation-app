module Scripts
  class MailChimpSync
    def self.sync_all
      execution = []
      User.includes(:subscriptions, :profile, :referral_code, :advertisement_code, :current_valid_subscriptions).find_in_batches(batch_size: 200) do |group|
        group.each { |user| execution << MailChimpService.sync_and_tag(user) }
      end
      return execution
    end
  end
end