json.item do
  json.merge!   @item.attributes
  json.up_next  @item.user_has_reservation?(@current_user)
end