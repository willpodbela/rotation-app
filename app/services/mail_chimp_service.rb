class MailChimpService
  class << self
    
    # Should be called when profile information is updated or re-tagging is needed
    def sync_and_tag(user)
      gibbon_req.lists(list_id).members(subscriber_hash(user)).upsert(body: {email_address: user.email, status: "subscribed", merge_fields: {}})
    end
    
    #private
    
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
    
  end
end