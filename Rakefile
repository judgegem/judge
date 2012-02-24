require "bundler/gem_tasks"
require "jasmine"
require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new("spec")

load "jasmine/tasks/jasmine.rake"
load "lib/tasks/js_tests.rake"

desc "Run all tests"
task :default => ["spec", "jasmine:phantom"]