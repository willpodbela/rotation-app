class AddStripeCustomerIdToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :stripe_customer_id, :string, :null => true
    add_index :users, :stripe_customer_id, unique: true
  end
end
