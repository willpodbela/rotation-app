require 'test_helper'

class FulfillmentControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get fulfillment_index_url
    assert_response :success
  end

end
