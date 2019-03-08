class Code < ApplicationRecord
  self.primary_key = :id
  
  def coupon
    StripeService.get_coupon(self)
  end
end
