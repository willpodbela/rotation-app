class Code < ApplicationRecord
  self.primary_key = :id
  
  scope :active, -> { where(active: true) } 
  
  after_create do |code|
    self.update(has_stripe_coupon: true) unless self.coupon.nil?
  end
  
  def coupon
    StripeService.get_coupon(self)
  end
end
