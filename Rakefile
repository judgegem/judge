require "bundler/gem_tasks"

require 'rdoc/task'
require 'jasmine'
require 'rake/testtask'

load 'jasmine/tasks/jasmine.rake'
load 'lib/tasks/js_tests.rake'

RDoc::Task.new do |rdoc|
  version = Judge::VERSION
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title = "judge #{version}"
  rdoc.rdoc_files.include('README*')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

namespace :test do
  Rake::TestTask.new(:ruby) do |test|
    test.libs << 'lib' << 'test'
    test.pattern = 'test/**/test_*.rb'
    test.verbose = true
  end
end

desc "Run all tests"
task :test => ["test:ruby", "jasmine:phantom"]
