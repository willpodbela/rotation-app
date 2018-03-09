json.items @items do |item|
  json.merge!       item.attributes
  json.my_rotation  item.user_has_reservation_now?(@current_user)
  json.up_next      item.user_has_reservation_future?(@current_user)
  json.image_url    item.image.url
end