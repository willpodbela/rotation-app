class CreateReferralCodes < ActiveRecord::Migration[5.1]
  def change
    create_table :referral_codes do |t|
      t.string :description, :null => false
      t.string :code, :null => false, unique: true
      t.integer :limit
      t.datetime :expires
      
      t.timestamps
    end
  end
end
