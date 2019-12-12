class CreateCommunications < ActiveRecord::Migration[5.1]
  def change
    create_table :communications do |t|
      t.string :email, null: false
      t.string :message_name, null: false
      
      t.timestamps
    end
  end
end
