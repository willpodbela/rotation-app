class Item < ApplicationRecord
	has_attached_file :image, 
		url: "/system/:hash.:extension",
		hash_secret: "longSecretString",
		styles: {
			thumb: ["300x300#", :jpeg],
			original: [:jpeg]
		},
		convert_options: {
			thumb: "-quality 70 -strip",
			original: "-quality 90"
		},


	validates_attachment :image,
		content_type: { content_type: /\Aimage\/.*\z/ },
        size: { less_than: 10.megabyte }
end
