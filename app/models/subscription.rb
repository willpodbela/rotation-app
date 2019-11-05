require 'date'

class Subscription < ApplicationRecord
  belongs_to :user
  scope :current, -> { where('current_period_end >= ?', Date.today) }
  scope :active, -> { where(status: :active) }
  scope :canceled, -> { where(status: :canceled) }
  scope :valid, -> { where(status: [:active, :canceled]) }
    
  enum billing_status: [ :paid, :payment_failed, :payment_action_required ]
  enum status: [ :active, :canceled, :ended ]
      
  def stripe_subscription_obj=(obj)
    self.start = Time.at(obj.start).to_datetime
    self.current_period_start = Time.at(obj.current_period_start).to_datetime
    self.current_period_end = Time.at(obj.current_period_end).to_datetime
        
    case obj.status
    when "canceled"
      self.status = :ended
    when "incomplete"
      self.billing_status = :payment_action_required
      self.status = :active
    when "past_due"
      self.billing_status = :payment_failed
      self.status = :active
    when "unpaid"
      self.billing_status = :payment_failed
      self.status = :active
    when "incomplete_expired"
      self.status = :ended
    else
      self.billing_status = :paid
      # active, trialing, or otherwise
      if obj.cancel_at_period_end
        self.status = :canceled
      else
        self.status = :active
      end
    end
    
    if self.payment_action_required?
      payment_intent = StripeService.get_payment_intent(obj.latest_invoice)
      subscription.update_attributes(incomplete_payment_intent_client_secret: payment_intent[:client_secret])
    end
    
    @stripe_subscription_obj=obj
  end
  
  before_create do
    if @stripe_subscription_obj
      self.stripe_subscription_id = @stripe_subscription_obj.id
    end
  end
  
  after_save do |subscription|
    MailChimpService.sync_and_tag(subscription.user)
  end
  
  class << self
    #Class Method for updating Subscription objects with stripe webhooks
    def process_stripe_webhook(subscription_id, params)
      subscription = Subscription.find_by_stripe_subscription_id(subscription_id)
      subscription.update_attributes(params)
    end
  end
end
