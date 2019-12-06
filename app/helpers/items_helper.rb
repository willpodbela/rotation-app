module ItemsHelper
  def reservation(user, item)
    res = @current_user.live_reservations.select {|s| s.item_id == item.id}.first
    res ||= @current_user.scheduled_reservations.select {|s| s.item_id == item.id}.first
    return res.nil? ? nil : res.attributes
  end

  # DEPRECATED as of iOS < v1.2 as api/v2 no longer uses these helper functions
  def my_rotation_reservation_id(user, item)
    res = @current_user.live_reservations.select {|s| s.item_id == item.id}.first
    return res.nil? ? nil : res.id
  end
  
  def up_next_reservation_id(user, item)
    res = @current_user.scheduled_reservations.select {|s| s.item_id == item.id}.first
    return res.nil? ? nil : res.id
  end
  # END DEPRECATED
end
