module Scripts
  class MailChimpSync
    def self.sync_all
      for user in User.all.includes(:subscriptions, :profile, :referral_code, :advertisement_code, :current_valid_subscriptions).to_a
        MailChimpService.sync_and_tag(user)
      end
    end
  end
end