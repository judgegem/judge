require 'rubygems'
require 'bundler'
require 'rake'
require 'jeweler'
require 'rdoc/task'
require 'jasmine'
require 'rake/testtask'

load 'jasmine/tasks/jasmine.rake'
load 'lib/tasks/js_tests.rake'

begin
  Bundler.setup(:default, :development)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end

Jeweler::Tasks.new do |gem|
  gem.name = "judge"
  gem.homepage = "http://github.com/joecorcoran/judge"
  gem.license = "MIT"
  gem.summary = %Q{Simple client-side ActiveModel::Validators}
  gem.description = %Q{Validate forms in-place using your model validations}
  gem.email = "joe@tribesports.com"
  gem.authors = ["Joe Corcoran"]
end
Jeweler::RubygemsDotOrgTasks.new

RDoc::Task.new do |rdoc|
  version = File.exist?('VERSION') ? File.read('VERSION') : ""

  rdoc.rdoc_dir = 'rdoc'
  rdoc.title = "judge #{version}"
  rdoc.rdoc_files.include('README*')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

namespace :test do
  Rake::TestTask.new(:form) do |test|
    test.libs << 'lib' << 'test'
    test.pattern = 'test/**/*_test.rb'
    test.verbose = true
  end
  
  desc "Run javascript tests"
  task :js => ["jasmine:phantom"]
end

desc "Run all tests"
task :test => ["test:form", "test:js"]
