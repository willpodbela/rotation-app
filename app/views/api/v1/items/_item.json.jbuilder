json.merge!         item.attributes
json.my_rotation                  (@current_user.my_rotation_items.include? item)
json.my_rotation_reservation_id   (@current_user.live_reservations.select {|s| s.item_id == item.id}.first.id rescue nil)
json.up_next                      (@current_user.up_next_items.include? item)
json.up_next_reservation_id       (@current_user.scheduled_reservations.select {|s| s.item_id == item.id}.first.id rescue nil)
json.image_url      item.image.url
json.image_url_small      item.image.url(:small)
json.image_url_large      item.image.url(:large)
json.num_available  item.num_available
