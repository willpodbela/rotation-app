class PrelaunchUser < ApplicationRecord
  has_many :invited_users, class_name: "PrelaunchUser", foreign_key: :inviter_id
  belongs_to :invited_by_user, class_name: "PrelaunchUser", foreign_key: :inviter_id, optional: true

  before_create :ensure_invite_code
  before_save { email.downcase! }
  
  after_create do |user|
    MailChimpService.register_prelauncher_user(user)
    CustomerFeedbackMailer.with(user: prelaunch_user).founder_hello.deliver_later(wait_until: CustomerFeedbackMailer.preferred_time)
  end

  def valid_invited_users_count
    invited_users.where(bounced: false).pluck(:ip_address).uniq.count
  end

  def ensure_invite_code
    if self.invite_code.nil?
      self.invite_code = generate_invite_code
    end
  end

  def generate_invite_code
    loop do
      code = SecureRandom.hex(5)
      break code unless self.class.where(invite_code: code).exists?
    end
  end
end
