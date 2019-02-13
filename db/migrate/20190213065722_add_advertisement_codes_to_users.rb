class AddAdvertisementCodesToUsers < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :advertisement_code, foreign_key: true
  end
end
