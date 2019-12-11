json.merge!         item.attributes
if !@current_user.nil?
  json.is_favorite                  @favorite_item_ids.include? item.id
  json.reservation do
    json.merge!                       reservation(@current_user, item)
  end
else
  json.is_favorite  nil
  json.reservation  nil
end
json.image_url      item.image.url
json.image_url_small      item.image.url(:small)
json.image_url_large      item.image.url(:large)
json.num_available  @inventory.total_available(item)
json.sizes          @inventory.size_availability(item)
