class AddIncompletePaymentIntentClientSecretToSubscriptions < ActiveRecord::Migration[5.1]
  def change
    add_column :subscriptions, :incomplete_payment_intent_client_secret, :string
    add_column :subscriptions, :latest_invoice_id, :string
  end
end
