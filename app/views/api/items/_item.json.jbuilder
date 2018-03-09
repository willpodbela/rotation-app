json.merge!         item.attributes
json.my_rotation                  item.user_has_reservation_now?(@current_user)
json.my_rotation_reservation_id   item.my_rotation_reservation_id(@current_user)
json.up_next                      item.user_has_reservation_future?(@current_user)
json.up_next_reservation_id       item.up_next_reservation_id(@current_user)
json.image_url      item.image.url
json.num_available  item.num_available