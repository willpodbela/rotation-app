# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190213065722) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "advertisement_codes", force: :cascade do |t|
    t.string "description", null: false
    t.string "code", null: false
    t.index ["code"], name: "index_advertisement_codes_on_code", unique: true
  end

  create_table "devices", force: :cascade do |t|
    t.string "token", limit: 64, null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token", "user_id"], name: "index_devices_on_token_and_user_id"
    t.index ["token"], name: "index_devices_on_token", unique: true
  end

  create_table "items", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.integer "quantity", default: 0, null: false
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_file_name"
    t.string "image_content_type"
    t.integer "image_file_size"
    t.datetime "image_updated_at"
    t.string "subtitle"
    t.string "retail_value"
    t.string "color"
    t.string "buyURL"
    t.boolean "hidden", default: false
    t.boolean "company_owned", default: true, null: false
    t.datetime "last_seen"
    t.text "alternate_image_urls", default: [], array: true
  end

  create_table "profiles", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "instagram_auth_token"
    t.string "instagram_handle"
    t.integer "instagram_follower_count"
    t.integer "instagram_following_count"
    t.integer "instagram_post_count"
    t.datetime "instagram_last_refresh"
    t.string "address_line_one"
    t.string "address_line_two"
    t.string "address_city"
    t.string "address_state"
    t.string "address_zip"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id", unique: true
  end

  create_table "referral_codes", force: :cascade do |t|
    t.string "description", null: false
    t.string "code", null: false
    t.integer "limit"
    t.datetime "expires"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reservations", force: :cascade do |t|
    t.integer "item_id"
    t.integer "user_id"
    t.datetime "start_date"
    t.datetime "end_date"
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id", "user_id"], name: "index_reservations_on_item_id_and_user_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.string "stripe_subscription_id", null: false
    t.string "stripe_plan_id", null: false
    t.integer "status", null: false
    t.integer "billing_status"
    t.integer "user_id", null: false
    t.datetime "start", null: false
    t.datetime "current_period_start", null: false
    t.datetime "current_period_end", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["stripe_subscription_id"], name: "index_subscriptions_on_stripe_subscription_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "authentication_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "access_level", default: 0, null: false
    t.string "stripe_customer_id"
    t.bigint "referral_code_id"
    t.bigint "advertisement_code_id"
    t.index ["advertisement_code_id"], name: "index_users_on_advertisement_code_id"
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["referral_code_id"], name: "index_users_on_referral_code_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["stripe_customer_id"], name: "index_users_on_stripe_customer_id", unique: true
  end

  add_foreign_key "users", "advertisement_codes"
  add_foreign_key "users", "referral_codes"
end
