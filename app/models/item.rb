class Item < ApplicationRecord
  has_many :reservations
  has_many :users, through: :reservations
  
  has_many :live_reservations, -> { live }, class_name: "Reservation"
  has_many :scheduled_reservations, -> { scheduled }, class_name: "Reservation"
  
  scope :visible, -> { where hidden: false }
  scope :company_owned, -> { where company_owned: true }
  scope :not_company_owned, -> { where company_owned: false }
  scope :with_images, -> { where('image_file_name IS NOT NULL') }
  scope :without_images, -> { where('image_file_name IS NULL') }
  scope :with_alternate_image_options, -> { where("alternate_image_urls != '{}'") }
  
  attr_reader :image_remote_url
  
	has_attached_file :image,
		url: "/system/:hash.:extension",
		hash_secret: "longSecretString",
		styles: {
			thumb: ["300x300#", :jpeg],
			original: [:jpeg],
      small: ["620x", :jpeg],
      large: ["1200x", :jpeg]
		},
		convert_options: {
			thumb: "-quality 70 -strip",
			original: "-quality 90",
      small: "-quality 70",
      large: "-quality 80"
		},
		storage: :s3,
		s3_credentials: {
			access_key_id: ENV["AWS_ACCESS_KEY_ID"],
            secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"],
			bucket: ENV["AWS_S3_BUCKET"]
		},
		s3_region: "us-east-2",
		s3_host_name: "s3.us-east-2.amazonaws.com"


  validates :buyURL, uniqueness: true, :allow_blank => true, :allow_nil => true
	validates_attachment :image,
		content_type: { content_type: /\Aimage\/.*\z/ },
        size: { less_than: 10.megabyte }
  
  before_save do
    if subtitle
      self.subtitle = self.subtitle.strip
    end
  end
  
  def image_remote_url=(url_value)
    self.image = URI.parse(url_value)
    @image_remote_url = url_value
  end
  
  def user_has_reservation_now?(user)
    user.my_rotation_items.include? self
  end

  def my_rotation_reservation_id(user)
    if self.user_has_reservation_now?(user)
      return user.live_reservations.select {|s| s.item_id == i.id}.first
    else
      return nil
    end
  end

  def user_has_reservation_future?(user)
    user.up_next_items.include? self
  end

  def up_next_reservation_id(user)
    if self.user_has_reservation_future?(user)
      return user.scheduled_reservations.select {|s| s.item_id == i.id}.first
    else
      return nil
    end
  end
  
  def num_available
    (company_owned ? self.quantity : 2) - self.live_reservations.size - self.scheduled_reservations.size
  end

  def self.catalog(user)
    Item.all - Item.my_rotation(user) - Item.up_next(user)
  end
end
