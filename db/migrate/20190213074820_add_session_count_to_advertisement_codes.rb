class AddSessionCountToAdvertisementCodes < ActiveRecord::Migration[5.1]
  def change
    add_column :advertisement_codes, :session_count, :integer, default: 0
  end
end
