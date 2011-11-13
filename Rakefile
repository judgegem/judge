require "bundler/gem_tasks"
require "jasmine"
require "rake/testtask"

load "jasmine/tasks/jasmine.rake"
load "lib/tasks/js_tests.rake"

namespace :test do
  Rake::TestTask.new(:ruby) do |test|
    test.libs << "lib" << "test"
    test.pattern = "test/**/test_*.rb"
    test.verbose = true
  end
end

desc "Run all tests"
task :test => ["test:ruby", "jasmine:phantom"]