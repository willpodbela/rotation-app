require 'test_helper'

class UnitsControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get units_edit_url
    assert_response :success
  end

  test "should get index" do
    get units_index_url
    assert_response :success
  end

  test "should get show" do
    get units_show_url
    assert_response :success
  end

  test "should get view" do
    get units_view_url
    assert_response :success
  end

end
