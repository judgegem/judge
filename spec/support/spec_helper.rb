require "bundler/setup"
require "active_record"
require "action_view"
require "judge"
require "rspec"
require "factory_girl"
require "support/validators/city_validator"
require "setup"
require "support/factories"

RSpec.configure do |config|
  config.color_enabled = true
end