require 'date'

class Subscription < ApplicationRecord
  belongs_to :user
  scope :current, -> { where('current_period_end >= ?', Date.today) }
  scope :active, -> { where(status: :active) }
  scope :active, -> { where(status: :canceled) }
  scope :valid, -> { where(status: [:active, :canceled]) }
    
  enum billing_status: [ :paid, :payment_failed ]
  enum status: [ :active, :canceled, :ended ]
  
  def stripe_subscription_obj=(obj)
    self.start = Time.at(obj.start).to_datetime
    self.current_period_start = Time.at(obj.current_period_start).to_datetime
    self.current_period_end = Time.at(obj.current_period_end).to_datetime
    
    if obj.status == "canceled"
      self.status = :ended
    elsif obj.cancel_at_period_end
      self.status = :canceled
    else
      self.status = :active
    end
    
    @stripe_subscription_obj=obj
  end
  
  before_create do
    if @stripe_subscription_obj
      self.stripe_subscription_id = @stripe_subscription_obj.id
    end
  end
  
  class << self
    #Class Method for updating Subscription objects with stripe webhooks
    def process_stripe_webhook(subscription_id, params)
      subscription = Subscription.find_by_stripe_subscription_id(subscription_id)
      subscription.update_attributes(params)
    end
  end
end
