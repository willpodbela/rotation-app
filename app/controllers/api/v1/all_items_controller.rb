include Queries

module Api
  module V1
    class AllItemsController < Api::V1::BaseController
      skip_before_action :authenticate_user_from_token!

      def index
        render json: { items: Item.visible.with_images.where(query_params) }
      end

      private

      def query_params
        params.permit()
      end
    end
  end
end
