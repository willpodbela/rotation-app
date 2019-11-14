class ReferralCode < Code
  has_many :users
  
  before_create { id.upcase! }
end