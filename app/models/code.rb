class Code < ApplicationRecord
  self.primary_key = :id
  
  after_create do |code|
    self.update(has_stripe_coupon: true) unless self.coupon.nil?
  end
  
  def coupon
    StripeService.get_coupon(self)
  end
end
