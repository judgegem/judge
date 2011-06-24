require "rubygems"
require "bundler"
require "shoulda"
require "action_view"
require "active_support"
require "nokogiri"
require "json"

begin
  Bundler.setup(:default, :development)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end

ENV["RAILS_ENV"] = "test"

$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), "..", "lib"))
$LOAD_PATH.unshift(File.dirname(__FILE__))
require "judge"
require "dummy/config/environment"
require "rails/test_help"
