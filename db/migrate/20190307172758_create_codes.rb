class CreateCodes < ActiveRecord::Migration[5.1]
  def change
    create_table :codes, id: false do |t|
      t.string      :id, null: false
      t.string      :type, null: false
      t.string      :description
      t.boolean     :has_stripe_coupon, default: false
      t.integer     :session_count, default: 0
      t.boolean     :active, default: true
      t.timestamps
    end
    
    add_index :codes, :id, unique: true
    
    remove_reference :users, :advertisement_code, foreign_key: true
    remove_reference :users, :referral_code, foreign_key: true
    add_reference :users, :advertisement_code, type: :string
    add_reference :users, :referral_code, type: :string
  end
end
