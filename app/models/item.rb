class Item < ApplicationRecord
  has_many :reservations
  has_many :users, through: :reservations

	has_attached_file :image, 
		url: "/system/:hash.:extension",
		hash_secret: "longSecretString",
		styles: {
			thumb: ["300x300#", :jpeg],
			original: [:jpeg]
		},
		convert_options: {
			thumb: "-quality 70 -strip",
			original: "-quality 90"
		},
		storage: :s3,
		s3_credentials: {
			access_key_id: ENV["AWS_ACCESS_KEY_ID"],
            secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"],
			bucket: ENV["AWS_S3_BUCKET"]
		},
		s3_region: "us-east-2",
		s3_host_name: "s3.us-east-2.amazonaws.com"


	validates_attachment :image,
		content_type: { content_type: /\Aimage\/.*\z/ },
        size: { less_than: 10.megabyte }
  
  def user_has_reservation_now?(user)
    self.reservations.for_user(user).now.front_cycle_statuses.count > 0
  end
  
  def user_has_reservation_future?(user)
    self.reservations.for_user(user).future.front_cycle_statuses.count > 0
  end
end
