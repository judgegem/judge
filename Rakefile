require "bundler/gem_tasks"

=begin  
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
    gem.summary = %Q{Simple client side ActiveModel::Validators}
    gem.description = %Q{Validate forms on the client side, cleanly}
    gem.email = "joe@tribesports.com"
    gem.authors = ["Joe Corcoran"]
    gem.add_development_dependency "jeweler",       "~> 1.5.2"
    gem.add_development_dependency "jasmine",       "~> 1.0.2"
    gem.add_development_dependency "rails",         "~> 3.0.10"
    gem.add_development_dependency "shoulda",       "~> 2.11.3"
    gem.add_development_dependency "sqlite3-ruby",  "~> 1.3.2"
    gem.add_development_dependency "nokogiri",      "~> 1.5.0"
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
    Rake::TestTask.new(:ruby) do |test|
      test.libs << 'lib' << 'test'
      test.pattern = 'test/**/test_*.rb'
      test.verbose = true
    end
    
    desc "Run all JavaScript tests"
    task :js => ["jasmine:phantom"]
  end

  desc "Run all tests"
  task :test => ["test:ruby", "test:js"]
=end