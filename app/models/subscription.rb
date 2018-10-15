require 'date'

class Subscription < ApplicationRecord
  belongs_to :user
  scope :current, -> { where('current_period_end >= ?', Date.today) }
    
  enum billing_status: [ :paid, :payment_failed ]
  enum status: [ :active, :canceled ]
  
  def stripe_subscription_obj=(obj)
    self.start = Time.at(obj.start).to_datetime
    self.current_period_start = Time.at(obj.current_period_start).to_datetime
    self.current_period_end = Time.at(obj.current_period_end).to_datetime
    
    @stripe_subscription_obj=obj
  end
  
  before_create do
    if @stripe_subscription_obj
      self.stripe_subscription_id = @stripe_subscription_obj.id
    end
    self.status = :active
  end
  
  class << self
    #Class Method for updating Subscription objects with stripe webhooks
    def process_stripe_webhook(subscription_id, params)
      subscription = Subscription.find_by_stripe_subscription_id(subscription_id)
      subscription.update_attributes(params)
    end
  end
end
