class Profile < ApplicationRecord
  belongs_to :user

  after_save :async_fetch_instagram_data_if_needed
  after_save do |profile|
    MailChimpService.sync_and_tag(profile.user)
  end
  
  before_save do |profile| 
    if (limit = Integer(ENV['USER_AUTOENROLL_LIMIT']) rescue false) && (zip = Integer(profile.address_zip) rescue false)
      acceptable_zip_codes = [10453, 10457, 10460, 10458, 10467, 10468, 10451, 10452, 10456, 10454, 10455, 10459, 10474, 10463, 10471, 10466, 10469, 10470, 10475, 10461, 10462, 10464, 10465, 10472, 10473, 11212, 11213, 11216, 11233, 11238, 11209, 11214, 11228, 11204, 11218, 11219, 11230, 11234, 11236, 11239, 11223, 11224, 11229, 11235, 11201, 11205, 11215, 11217, 11231, 11203, 11210, 11225, 11226, 11207, 11208, 11211, 11222, 11220, 11232, 11206, 11221, 11237, 10026, 10027, 10030, 10037, 10039, 10001, 10011, 10018, 10019, 10020, 10036, 10029, 10035, 10010, 10016, 10017, 10022, 10012, 10013, 10014, 10004, 10005, 10006, 10007, 10038, 10280, 10002, 10003, 10009, 10021, 10028, 10044, 10065, 10075, 10128, 10023, 10024, 10025, 10031, 10032, 10033, 10034, 10040, 11361, 11362, 11363, 11364, 11354, 11355, 11356, 11357, 11358, 11359, 11360, 11365, 11366, 11367, 11412, 11423, 11432, 11433, 11434, 11435, 11436, 11101, 11102, 11103, 11104, 11105, 11106, 11374, 11375, 11379, 11385, 11691, 11692, 11693, 11694, 11695, 11697, 11004, 11005, 11411, 11413, 11422, 11426, 11427, 11428, 11429, 11414, 11415, 11416, 11417, 11418, 11419, 11420, 11421, 11368, 11369, 11370, 11372, 11373, 11377, 11378, 10302, 10303, 10310, 10306, 10307, 10308, 10309, 10312, 10301, 10304, 10305, 10314]
    
      if (User.paying_customers.size < limit) && (acceptable_zip_codes.include? zip)
        u = profile.user
        u.access_level = :standard
        u.save
      end
    end
  end
  
  def async_fetch_instagram_data_if_needed
    if saved_change_to_instagram_auth_token?
      Thread.new do
        Rails.application.executor.wrap do
          fetch_instagram_data
        end
      end
    end
  end
  
  def fetch_instagram_data 
    res = HTTP.get("https://api.instagram.com/v1/users/self/?access_token=#{instagram_auth_token}")
    hash = JSON.parse res.to_s
    if hash["meta"]["code"] == 200
      self.instagram_handle = hash["data"]["username"]
      self.instagram_post_count = hash["data"]["counts"]["media"]
      self.instagram_following_count = hash["data"]["counts"]["follows"]
      self.instagram_follower_count = hash["data"]["counts"]["followed_by"]
      self.instagram_last_refresh = DateTime.current
      self.save
    end
  end
  
  def full_address
    [address_line_one, address_line_two, address_city, address_state, address_zip].compact.split("").flatten.join(", ")
  end
  
  def full_name
    [first_name, last_name].compact.join(" ")
  end
end
