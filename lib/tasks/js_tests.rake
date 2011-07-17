namespace :jasmine do
  task :require_phantom_js do
    sh "which phantomjs" do |ok, res|
      fail 'Cannot find phantomjs on $PATH' unless ok
    end
  end

  desc "Run continuous integration tests headlessly with phantom.js"
  task :phantom => ['jasmine:require', 'jasmine:require_phantom_js'] do
    support_dir = File.expand_path('../../spec/javascripts/support', File.dirname(__FILE__))
    config_overrides = File.join(support_dir, 'jasmine_config.rb')
    require config_overrides if File.exists?(config_overrides)
    phantom_js_runner = File.join(support_dir, 'phantomRunner.js')

    config = Jasmine::Config.new

    # start the Jasmine server and wait up to 10 seconds for it to be running:
    config.start_jasmine_server

    jasmine_url = "#{config.jasmine_host}:#{config.jasmine_server_port}"
    puts "Running tests against #{jasmine_url}"
    sh "phantomjs #{phantom_js_runner} #{jasmine_url}" do |ok, res|
      fail "jasmine suite failed" unless ok
    end
  end
end

