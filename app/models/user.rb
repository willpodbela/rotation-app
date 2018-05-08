class User < ApplicationRecord
  has_many :reservations
  has_many :items, through: :reservations
  has_one  :profile

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable
  
  before_save :ensure_authentication_token
  
  enum access_level: [ :waitlist, :standard, :admin ]
  
  def ensure_authentication_token
    if authentication_token.blank?
      renew_authentication_token
    end
  end
  
  def renew_authentication_token
    self.authentication_token = generate_authentication_token
  end
 
  private
  
  def generate_authentication_token
    loop do
      token = SecureRandom.hex
      break token unless User.where(authentication_token: token).first
    end
  end
end
