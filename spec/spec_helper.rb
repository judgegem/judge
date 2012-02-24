require "bundler/setup"
require "active_record"
require "action_view"
require "judge"
require "rspec"
require "factory_girl"
require "setup"

require_relative "factories"

RSpec.configure do |config|
  config.color_enabled = true
end