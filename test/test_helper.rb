$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), "..", "lib"))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__)))

# require dependencies
%w{rubygems bundler shoulda active_record}.each do |x|
	require x
end

# require judge and test setup files
%w{judge setup}.each do |x|
	require x
end

begin
  Bundler.setup(:default, :test)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end