class AdminBaseController < ApplicationController
  # This class contains shared logic for admin backend pages. Meant to be subclassed by actual page controllers.

  helper_method :sort_column, :sort_direction

  # -- Methods for ordering by columns in Admin UI
  
  private
  
  # Returns the allowed parameters for ordering by columns
  # Override this method in each API controller
  # @return [String]
  def sortable_columns
    []
  end

  def sort_column
    sortable_columns.include?(params[:column]) ? params[:column] : "id"
  end

  def sort_direction
    %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
  end
end
