class MailChimpService
  class << self
    
    # Should be called when profile information is updated or re-tagging is needed
    def sync_and_tag(user)
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
      
      gibbon_req.lists(list_id).members(subscriber_hash(user)).upsert(body: {email_address: user.email, status: "subscribed", merge_fields: merge_fields})
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
    
    #wip
    
    def get_tags(user)
      gibbon_req.lists(list_id).members(subscriber_hash(user)).tags.retrieve
    end
    
    def add_tags(user, tags=[])
    
    end
    
    def remove_tags(user, tags=[])
    
    end
    
  end
end