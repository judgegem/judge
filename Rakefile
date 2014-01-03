#!/usr/bin/env rake
begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end

require_relative 'spec/javascripts/javascript_spec_server'
require 'appraisal'
require 'rspec/core/rake_task'
RSpec::Core::RakeTask.new(:spec)

APP_RAKEFILE = File.expand_path('../spec/dummy/Rakefile', __FILE__)
load 'rails/tasks/engine.rake'

desc 'Require phantomjs'
task :phantomjs do
  sh 'which phantomjs' do |ok, ps|
    fail 'phantomjs not found' unless ok
  end
end

desc 'Run JavaScript tests'
task :js => [:phantomjs] do
  port = 8080
  server = JavascriptSpecServer.new(port, './')
  server.boot
  sh "phantomjs spec/javascripts/run.js #{port}" do |ok, ps|
    exit(ps.exitstatus)
  end
end

desc 'Run all tests'
task :default => [:spec, :js]

Bundler::GemHelper.install_tasks
