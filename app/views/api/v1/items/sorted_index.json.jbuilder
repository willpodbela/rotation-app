json.items do
  json.my_rotation @my_rotation, partial: 'item', as: :item
  json.up_next @up_next, partial: 'item', as: :item
  json.catalog @catalog, partial: 'item', as: :item
end
json.reservation_info @reservation_info