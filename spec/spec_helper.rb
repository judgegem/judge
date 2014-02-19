ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../spec/dummy/config/environment', __FILE__)

require 'rspec/rails'
require 'rspec/autorun'
require 'factory_girl'
require 'factories/factories'

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.color = false
  config.formatter = 'TapFormatter'
end
