module Queries
  # Queries module contains query/report classes
  # Individual classes are auto-loaded from the queries/ directory
  
  # Tell Zeitwerk how to load classes in this namespace
  def self.load_classes
    Inventory
    SortedCatalog
  end
end
