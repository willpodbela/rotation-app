namespace :rotation do
  desc "Import Unit Data from CSV"
  task import: :environment do
    require 'csv'
    csv_text = File.read('lib/assets/units.csv')
    csv = CSV.parse(csv_text, :headers => true)
    csv.each do |row|
      data = row.to_hash
      data["status"] = 2
      data["item_id"] = data["item_id"].to_i
      data["cost"] = data["cost"].to_i
      data["order_date"] = Date.strptime(data["order_date"], '%m/%d/%Y')
      Unit.create(data)
    end
  end

end
