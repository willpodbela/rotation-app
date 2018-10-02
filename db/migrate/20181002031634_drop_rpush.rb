class DropRpush < ActiveRecord::Migration[5.1]
  def up
    drop_table "rpush_apps"
    drop_table "rpush_feedback"
    drop_table "rpush_notifications"
  end

  def down
    create_table "rpush_apps", force: :cascade do |t|
      t.string "name", null: false
      t.string "environment"
      t.text "certificate"
      t.string "password"
      t.integer "connections", default: 1, null: false
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.string "type", null: false
      t.string "auth_key"
      t.string "client_id"
      t.string "client_secret"
      t.string "access_token"
      t.datetime "access_token_expiration"
    end

    create_table "rpush_feedback", force: :cascade do |t|
      t.string "device_token", limit: 64, null: false
      t.datetime "failed_at", null: false
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.integer "app_id"
      t.index ["device_token"], name: "index_rpush_feedback_on_device_token"
    end

    create_table "rpush_notifications", force: :cascade do |t|
      t.integer "badge"
      t.string "device_token", limit: 64
      t.string "sound"
      t.text "alert"
      t.text "data"
      t.integer "expiry", default: 86400
      t.boolean "delivered", default: false, null: false
      t.datetime "delivered_at"
      t.boolean "failed", default: false, null: false
      t.datetime "failed_at"
      t.integer "error_code"
      t.text "error_description"
      t.datetime "deliver_after"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.boolean "alert_is_json", default: false, null: false
      t.string "type", null: false
      t.string "collapse_key"
      t.boolean "delay_while_idle", default: false, null: false
      t.text "registration_ids"
      t.integer "app_id", null: false
      t.integer "retries", default: 0
      t.string "uri"
      t.datetime "fail_after"
      t.boolean "processing", default: false, null: false
      t.integer "priority"
      t.text "url_args"
      t.string "category"
      t.boolean "content_available", default: false, null: false
      t.text "notification"
      t.boolean "mutable_content", default: false, null: false
      t.string "external_device_id"
      t.index ["delivered", "failed", "processing", "deliver_after", "created_at"], name: "index_rpush_notifications_multi", where: "((NOT delivered) AND (NOT failed))"
    end
  end
end
