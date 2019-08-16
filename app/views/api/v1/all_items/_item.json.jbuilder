json.merge!         item.attributes
json.image_url      item.image.url
json.image_url_small      item.image.url(:small)
json.image_url_large      item.image.url(:large)
