class Item < ApplicationRecord
  has_many :reservations
  has_many :users, through: :reservations
  scope :my_rotation, ->(user) { joins(:reservations).merge(Reservation.for_user(user).now.front_cycle) }
  scope :up_next, ->(user) { joins(:reservations).merge(Reservation.for_user(user).future.front_cycle) }
  scope :visible, -> { where hidden: false }
  scope :company_owned, -> { where company_owned: true }
  scope :not_company_owned, -> { where company_owned: false }
  
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
  
  def my_rotation(user)
    self.reservations.for_user(user).now.front_cycle
  end

  def up_next(user)
    self.reservations.for_user(user).future.front_cycle
  end

  def user_has_reservation_now?(user)
    self.my_rotation(user).count > 0
  end

  def my_rotation_reservation_id(user)
    if self.user_has_reservation_now?(user)
      return self.my_rotation(user).first.id
    else
      return nil
    end
  end

  def user_has_reservation_future?(user)
    self.up_next(user).count > 0
  end

  def up_next_reservation_id(user)
    if self.user_has_reservation_future?(user)
      return self.up_next(user).first.id
    else
      return nil
    end
  end
  
  # NOTE: (#BETA) Very specific to the 2-week cycles and reservation restrictions of the beta.
  # This function returns whether or not there are any items available for reservation
  # during the next two week reservation period. Additionally, if the item is not "company_owned"
  # we pretend that we have 2. We will probably want to deprecate later.
  def num_available
    (company_owned ? self.quantity : 2) - self.reservations.next_period.live.count
  end

  def self.catalog(user)
    Item.all - Item.my_rotation(user) - Item.up_next(user)
  end
end
