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

# Handle S3 image URLs gracefully (if bucket not configured, use placeholder)
begin
  json.image_url      item.image.url
  json.image_url_small      item.image.url(:small)
  json.image_url_large      item.image.url(:large)
rescue
  # S3 not configured, use placeholder image
  json.image_url      "/images/placeholder.jpg"
  json.image_url_small      "/images/placeholder.jpg"
  json.image_url_large      "/images/placeholder.jpg"
end

json.num_available  @inventory.total_available(item)
json.sizes          @inventory.size_availability(item)
