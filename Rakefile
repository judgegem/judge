#!/usr/bin/env rake
begin
  require "bundler/setup"
rescue LoadError
  puts "You must `gem install bundler` and `bundle install` to run rake tasks"
end

require "appraisal"
require "jasmine"
require "rspec/core/rake_task"

RSpec::Core::RakeTask.new("spec")

APP_RAKEFILE = File.expand_path("../spec/dummy/Rakefile", __FILE__)

load "rails/tasks/engine.rake"
load "jasmine/tasks/jasmine.rake"
load "lib/tasks/js.rake"

desc "Run all tests"
task :default => ["spec", "jasmine:headless"]

Bundler::GemHelper.install_tasks