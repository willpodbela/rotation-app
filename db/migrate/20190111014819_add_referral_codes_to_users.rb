class AddReferralCodesToUsers < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :referral_code, foreign_key: true
  end
end
