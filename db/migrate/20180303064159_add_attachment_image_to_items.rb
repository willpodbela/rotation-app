class AddAttachmentImageToItems < ActiveRecord::Migration[5.1]
  # Paperclip's `t.attachment` helpers call into AR internals that changed
  # in newer ActiveRecord versions. Explicitly add the expected columns
  # so migrations run correctly under ActiveRecord 7.
  def self.up
    add_column :items, :image_file_name, :string
    add_column :items, :image_content_type, :string
    add_column :items, :image_file_size, :integer
    add_column :items, :image_updated_at, :datetime
  end

  def self.down
    remove_column :items, :image_file_name
    remove_column :items, :image_content_type
    remove_column :items, :image_file_size
    remove_column :items, :image_updated_at
  end
end
