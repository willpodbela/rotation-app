class AddAlternateImageUrlsToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :alternate_image_urls, :text, array: true, default: []
  end
end
