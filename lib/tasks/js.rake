namespace :jasmine do
  task :require_phantom do
    sh "which phantomjs" do |ok, res|
      fail 'Cannot find phantomjs on $PATH' unless ok
    end
  end

  task :require_casper do
    sh "which casperjs" do |ok, res|
      fail 'Cannot find casperjs on $PATH' unless ok
    end
  end

  desc "Run continuous integration tests headlessly with phantom.js"
  task :headless => ['jasmine:require', 'jasmine:require_phantom', 'jasmine:require_casper'] do
    support_dir = File.expand_path('../../spec/javascripts/support', File.dirname(__FILE__))
    config_overrides = File.join(support_dir, 'jasmine_config.rb')
    require config_overrides if File.exists?(config_overrides)
    
    test_runner = File.join(support_dir, 'runner.js')
    config = Jasmine::Config.new
    config.start_jasmine_server

    jasmine_url = "#{config.jasmine_host}:#{config.jasmine_server_port}"
    puts "Running tests against #{jasmine_url}"
    sh "casperjs #{test_runner} #{jasmine_url}" do |ok, res|
      fail "jasmine suite failed" unless ok
    end
  end
end

