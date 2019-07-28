module Scripts
  class MailChimpSync
    def self.sync_all
      execution = []
      for user in User.all.includes(:subscriptions, :profile, :referral_code, :advertisement_code, :current_valid_subscriptions).to_a
        execution << MailChimpService.sync_and_tag(user)
      end
      return execution
    end
  end
end