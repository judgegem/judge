require "bundler/setup"

# require dependencies
%w{rubygems bundler shoulda active_record}.each do |x|
	require x
end

# require judge and test setup files
%w{judge setup}.each do |x|
	require x
end

require "redgreen"