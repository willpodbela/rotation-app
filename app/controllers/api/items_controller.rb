module Api
  class ItemsController < Api::BaseController
    
    #Failsafe: Override endpoints that we don't want to make available
    def destroy
      render_error(405)
    end
    def update
      render_error(405)
    end
    def create    
      render_error(405)
    end
    
    private
    
    def item_params
      params.permit()
    end

    def query_params
      params.permit()
    end
    
  end
end