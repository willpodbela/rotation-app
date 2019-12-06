json.unit do
  json.merge!                 @unit.attributes
  json.item do
    json.merge!               @unit.item.attributes
    json.image_url            @unit.item.image.url
    json.image_url_small      @unit.item.image.url(:small)
    json.image_url_large      @unit.item.image.url(:large)
  end
end