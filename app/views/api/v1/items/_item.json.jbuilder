json.merge!         item.attributes
json.my_rotation                  @current_user.my_rotation_items.include? item
json.my_rotation_reservation_id   my_rotation_reservation_id(@current_user, item)
json.up_next                      @current_user.up_next_items.include? item
json.up_next_reservation_id       up_next_reservation_id(@current_user, item)
json.image_url      item.image.url
json.image_url_small      item.image.url(:small)
json.image_url_large      item.image.url(:large)
json.num_available  @inventory.total_available(item)
json.sizes          @inventory.size_availability(item)
