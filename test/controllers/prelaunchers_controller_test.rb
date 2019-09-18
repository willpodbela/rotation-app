require 'test_helper'

class PrelaunchersControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get prelaunchers_show_url
    assert_response :success
  end

end
