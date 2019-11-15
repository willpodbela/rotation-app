include Queries

module Api
  module Warehouse
    module V1
      class UnitsController < Api::V1::BaseController
        http_basic_authenticate_with name:ENV["WAREHOUSE_API_AUTH_NAME"], password:ENV["WAREHOUSE_API_AUTH_PASSWORD"], only: [:login, :forgot]
        skip_before_action :authenticate_user_from_token!
        around_action :render_item
    
        #Failsafe: Override endpoints that we don't want to make available
        def destroy
          render_error(405)
        end
        def create  
          render_error(405)
        end
    
        def returned
          unit = get_resource
          if unit.nil?
            if unit.live_reservations.count == 1
              r = unit.live_reservations.first
              r.status = :ended
              unless r.save
                # TODO: Log error, could not save
              end
            else
              # TODO: Log error, there were either multiple or no active reservations for this unit
            end
        
            unit.status = :offline
            unless unit.save
              render_error(500, nil)
            end
          else
            if params[:id].scan(/\D/).empty?
              # contains only digits
              render_error(404, "Unit does not exist in system. Please re-enter or notify a team member.")
            else
              render_error(404, "Could not find RFID tag in system. This is often due to natural interference. Please scan again or enter unit ID manually.")
            end
          end
        end

        private
    
        def units_params
          params.permit(:rfid_tag_id)
        end

        def query_params
          params.permit()
        end
    
        # Override set_resource implementation as [:id] can be either an id or rfid_tag_id
        def set_resource(resource = nil)
          resource ||= Unit.where(id: params[:id]).or(Unit.where(rfid_tag_id: params[:id])).first
      
          # Set instance variables for use in the global view template (fallback if no :show template is provided)
          instance_variable_set("@global_view_template_data", resource)
          instance_variable_set("@global_view_template_name", resource_name)
  
          instance_variable_set("@#{resource_name}", resource)
        end
    
        def render_item
          unless performed? || get_resource.nil?
            @item = get_resource.item
            render "api/warehouse/v1/items/show", status: :ok
          end
        end
      end
    end
  end
end
