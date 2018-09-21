module Api
    module V1
    class ItemsController < Api::V1::BaseController
      #http_basic_authenticate_with name:ENV["API_AUTH_NAME"], password:ENV["API_AUTH_PASSWORD"], only: [:create]
      skip_before_action :authenticate_user_from_token!, only: [:create]
      before_action :set_current_user, except: [:create]
      
      #Failsafe: Override endpoints that we don't want to make available
      def destroy
        render_error(405)
      end
      def update
        render_error(405)
      end
      
      # NOTE: Only to be called by our item scraper python script.
      def create  
        # Step 1: Set all existing items to hidden=ture WITHOUT saving to DB.
        all_items = Item.not_company_owned.all[0..-1]
        all_items.each{|i| i.hidden = true}
        
        count_start = all_items.count
        count_input = items_params[:items].count
        
        # Step 2: Iterate over all scraped items
        items_params[:items].each { |item|
          if i = all_items.detect{|i| i.buyURL == item[:buyURL]}
            # This item already exists in DB, switch it back to hidden=false and log now as last_seen
            i.hidden = false
            i.last_seen = DateTime.now
          else
            # This item is new, instantiate it to be inserted into the DB
            n = Item.new(item)
            n.company_owned = false
            all_items << n
          end
        }
        
        # Step 3: Save all to DB and return response
        
        # Monitoring / stats reporting counters
        count_added = 0
        count_removed = 0
        count_readded = 0
        count_success = 0
        count_failure = 0

        all_items.each{|i|
          if i.changed?
            if i.new_record?
              count_added += 1
            else
              if i.hidden
                count_removed += 1
              else
                count_readded += 1
              end
            end
            
            if i.save
              count_success += 1
            else
              count_failure += 1
            end
          end
        }
        
        count_end = Item.not_company_owned.count
          
        render :status=>200, :json => { :counts => {
          :start => count_start,
          :input => count_input,
          :added => count_added,
          :removed => count_removed,
          :readded => count_readded,
          :success => count_success,
          :failure => count_failure,
          :end => count_end
        }}
      end
    
      # Override: GET /api/{plural_resource_name}
      def index
        @items = Item.visible.where(query_params)
        .page(page_params[:page])
        .per(page_params[:page_size])
      
        if display_params[:sort_by_section] == "true"
          @my_rotation = Item.my_rotation(current_user)
          @up_next = Item.up_next(current_user)
          @catalog = Item.catalog(current_user)
        
          render :sorted_index
        else 
          render :index
        end
      end
    
      private
      
      #TODO: pull down and store in AWS
      def save_img(ssense_img_url)
        aws_url = "" 
        return aws_url
      end
    
      def items_params
        params.permit(items: [:retail_value, :subtitle, :image_url, :title, :buyURL, :image_remote_url])
      end
      
      def item_params
        params.permit()
      end

      def query_params
        params.permit()
      end
    
      def display_params
        params.permit(:sort_by_section)
      end
    
      def set_current_user
        @current_user = current_user
      end
      
    end
  end
end