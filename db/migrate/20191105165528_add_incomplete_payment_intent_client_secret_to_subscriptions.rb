class AddIncompletePaymentIntentClientSecretToSubscriptions < ActiveRecord::Migration[5.1]
  def change
    add_column :subscriptions, :incomplete_payment_intent_client_secret, :string
  end
end
