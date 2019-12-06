module Api
  module V2
    class AuthController < Api::V1::AuthController
    
    private
    
    # NOTE: Normally we'd copy the whole V1 class when making edits in V2, but this felt like a small enough change to still have everything else be inherited for now
    def login_render_view
      'api/v2/users/show'
    end
    
    end
  end
end
