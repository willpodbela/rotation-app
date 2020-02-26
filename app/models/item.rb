class Item < ApplicationRecord
  has_many :reservations
  has_many :users, through: :reservations
  has_many :units
  has_many :favorites
  
  has_many :live_reservations, -> { live }, class_name: "Reservation"
  has_many :scheduled_reservations, -> { scheduled }, class_name: "Reservation"
  has_many :not_cancelled_reservations, -> { not_cancelled }, class_name: "Reservation"
    
  scope :visible, -> { where hidden: false }
  scope :landing_featured, -> { where landing_featured: true }
  scope :with_images, -> { where('image_file_name IS NOT NULL') }
  scope :without_images, -> { where('image_file_name IS NULL') }
  scope :with_alternate_image_options, -> { where("alternate_image_urls != '{}'") }
  
  has_many :units_available_for_fulfillment, -> { available_for_rent.where(live_reservations_counter_cache: 0, scheduled_reservations_counter_cache: 0) }, class_name: "Unit"
  
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
  
  after_create do
    self.update_counter_cache
  end
  
  def image_remote_url=(url_value)
    unless url_value.nil?
      self.image = URI.parse(url_value)
      @image_remote_url = url_value
    end
  end
  
  # Total days rented across all reservations and units (active and ended)
  # eager_load not_cancelled_reservations when planning to make this call
  def cum_days_rented
    not_cancelled_reservations.to_a.sum(&:days)
  end
  
  # Sum of total days all units were in service for rental
  # eager_load units when planning to make this call
  def cum_days_units_in_service
    units.to_a.sum(&:days_in_service)
  end
  
  # Days since last rental ended. Will return 0 if there is an active rental. Will return
  # nil if item has never been rented.
  # eager_load not_cancelled_reservations when planning to make this call
  def days_since_last_rental
    if not_cancelled_reservations.length == 0
      return nil
    else
      (Time.zone.now - not_cancelled_reservations.to_a.map { |r| r.end_date || Time.zone.now } .max).to_i/1.days
    end
  end
  
  # Reservation objects must call this method every time they change status, are create, or are deleted
  def update_counter_cache
    self.live_reservations_counter_cache = self.live_reservations.size
    self.scheduled_reservations_counter_cache = self.scheduled_reservations.size
    self.save
  end
end
