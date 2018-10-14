class ServiceResponse
  attr_reader :success, :result, :errors
 
  def initialize(result = nil, success = true, errors = [])
    @result = result
    @success = success
    @errors = errors
  end
 
  def success?
    @success
  end
  
end