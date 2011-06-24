require 'rubygems'
require 'bundler'
begin
  Bundler.setup(:default, :development)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end
require 'rake'

require 'jeweler'
Jeweler::Tasks.new do |gem|
  gem.name = "judge"
  gem.homepage = "http://github.com/joecorcoran/judge"
  gem.license = "MIT"
  gem.summary = %Q{Simple client-side ActiveModel::Validators}
  gem.description = %Q{Validate forms in-place using your model validations}
  gem.email = "joe@tribesports.com"
  gem.authors = ["Joe Corcoran"]
  gem.add_development_dependency "bundler",     "~> 1.0.0"
  gem.add_development_dependency "jeweler",     "~> 1.5.2"
  gem.add_development_dependency "jasmine",     "~> 1.0.2"
  gem.add_development_dependency "rails",       "~> 3.0.3"
  gem.add_development_dependency "shoulda",     "~> 2.11.3"
  gem.add_development_dependency "sqlite-ruby", "~> 1.3.2"
  gem.add_development_dependency "nokogiri",    "~> 1.4.4"
  gem.add_development_dependency "json",        "~> 1.4.6"
end
Jeweler::RubygemsDotOrgTasks.new

require 'rake/testtask'
Rake::TestTask.new(:test) do |test|
  test.libs << 'lib' << 'test'
  test.pattern = 'test/**/*_test.rb'
  test.verbose = true
end

require 'rake/rdoctask'
Rake::RDocTask.new do |rdoc|
  version = File.exist?('VERSION') ? File.read('VERSION') : ""

  rdoc.rdoc_dir = 'rdoc'
  rdoc.title = "judge #{version}"
  rdoc.rdoc_files.include('README*')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

task :default => ["test", "jasmine:ci"]
