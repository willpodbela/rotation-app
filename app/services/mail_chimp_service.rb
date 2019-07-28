class MailChimpService
  require 'concurrent'
  
  ## Singleton Init
  # Uses Singleton patten so that requests can be dispatched and managed on a single Queue

  def initialize
    @thread_pool = Concurrent::FixedThreadPool.new(9)
  end

  @@instance = MailChimpService.new

  private_class_method :new
  
  class << self
    
    def instance
      return @@instance
    end
    
    # Convenience method for one and only instance method on Singleton
    def sync_and_tag(user)
      instance.sync_and_tag(user)
    end
    
  end
  
  ## Instance Methods

  # Should be called when profile information is updated or re-tagging is needed
  def sync_and_tag(user)
    Concurrent::Future.execute({ executor: @thread_pool }) do
      # Compile profile info and subscribe user to list
  
      merge_fields = {}
      prof = user.profile
      unless prof.nil?
        unless prof.first_name.nil?
          merge_fields[:FNAME] = prof.first_name
        end
        unless prof.last_name.nil?
          merge_fields[:LNAME] = prof.last_name
        end
        unless prof.full_address.empty?
          merge_fields[:ADDRESS] = {}
          merge_fields[:ADDRESS][:addr1] = (prof.address_line_one || "")
          merge_fields[:ADDRESS][:addr2] = (prof.address_line_two || "")
          merge_fields[:ADDRESS][:city] = (prof.address_city || "")
          merge_fields[:ADDRESS][:state] = (prof.address_state || "")
          merge_fields[:ADDRESS][:zip] = (prof.address_zip || "")
          merge_fields[:ADDRESS][:country] = "USA"
        end
      end
  
      gibbon_req.lists(list_id).members(subscriber_hash(user)).upsert(body: {email_address: user.email, status_if_new: "subscribed", merge_fields: merge_fields})

      # Recompute and set tags
  
      current_state = get_mailchimp_tags(user)
      future_state = compute_appropriate_tags(user)
  
      to_add = future_state - current_state
      to_remove = current_state - future_state - ignore_tags
  
      tag_params = []
      for tag in to_add do 
        tag_params << { name: tag, status: :active }
      end
      for tag in to_remove do 
        tag_params << { name: tag, status: :inactive }
      end
  
      gibbon_req.lists(list_id).members(subscriber_hash(user)).tags.create(body: {tags: tag_params})
    end
  end
  
  private
  
  ## These first two functions hold the business logic for tagging users in MailChimp
  
  # This is the business logic to compute the exhaustive and complete list of tags a 
  # user should be associated with at this given point in time.
  def compute_appropriate_tags(user)
    tags = []
    tags << "access-level-#{user.access_level}"
    tags << "referral-code-#{user.referral_code.id}" unless user.referral_code.nil?
    tags << "advertisement-code-#{user.advertisement_code.id}" unless user.advertisement_code.nil?
    
    subscription_tag = ""
    if user.current_subscription.nil?
      if user.subscriptions.empty?
        subscription_tag = "none"
      else
        subscription_tag = "churned"
      end
    else
      subscription_tag = "current-#{user.current_subscription.status}"
    end
    tags << "subscription-#{subscription_tag}"
  end
  
  # Use this function to list out any tags that should not be altered. These are usually
  # the tags that are set manually via the online dashboard.
  def ignore_tags
    ["investor"]
  end
  
  ## Helper methods
  
  def gibbon_req
    Gibbon::Request.new(api_key: ENV["MAIL_CHIMP_API_KEY"])
  end
  
  def list_id
    res = gibbon_req.lists.retrieve
    res.body["lists"].first["id"]
  end
  
  def subscriber_hash(user)
    Digest::MD5.hexdigest user.email.downcase
  end
      
  def get_mailchimp_tags(user)
    res = gibbon_req.lists(list_id).members(subscriber_hash(user)).tags.retrieve
    
    ret = []
    for tag_hash in res.body["tags"]
      ret << tag_hash["name"]
    end
    return ret
  end
end