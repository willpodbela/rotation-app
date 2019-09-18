class PrelaunchUser < ApplicationRecord
  has_many :invited_users, class_name: "PrelaunchUser", foreign_key: :inviter_id
  belongs_to :invited_by_user, class_name: "PrelaunchUser", foreign_key: :inviter_id, optional: true

  before_create :ensure_invite_code
  validate :unique_ip_for_user_invite

  after_create do |user|
    MailChimpService.register_prelauncher_user(user)
  end

  def unique_ip_for_user_invite
    ip = self.ip_address
    unless (self.invited_by_user.nil? || ip.nil?)
      if (self.invited_by_user.invited_users.map(&:ip_address).include? ip)
        errors.add(:invited_by_user, "Subscribing multiple emails from a single device is not allowed.")
      end
    end
  end

  def ensure_invite_code
    if self.invite_code.nil?
      self.invite_code = generate_invite_code
    end
  end

  def generate_invite_code
    loop do
      code = SecureRandom.hex(5)
      break code unless self.class.where(referral_code: code).exists?
    end
  end
end
