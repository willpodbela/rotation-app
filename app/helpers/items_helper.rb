module ItemsHelper
  def reservation(user, item)
    res = @current_user.live_reservations.select {|s| s.item_id == item.id}.first
    res ||= @current_user.scheduled_reservations.select {|s| s.item_id == item.id}.first
    return res.nil? ? nil : res.attributes
  end

  # START: DEPRECATED CODE BLOCK
  # These functions are deprecated. This code (and calling code in _item.json.jbuilder) should be removed in future versions

  def my_rotation_reservation_id(user, item)
    res = @current_user.live_reservations.select {|s| s.item_id == item.id}.first
    return res.nil? ? nil : res.id
  end
  
  def up_next_reservation_id(user, item)
    res = @current_user.scheduled_reservations.select {|s| s.item_id == item.id}.first
    return res.nil? ? nil : res.id
  end
  
  # END: DEPRECATED CODE BLOCK
end
