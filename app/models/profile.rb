class Profile < ApplicationRecord
  belongs_to :user

  after_save :async_fetch_instagram_data_if_needed
  
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
end
