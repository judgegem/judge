require "bundler/setup"

# require dependencies
%w{rubygems bundler shoulda factory_girl active_record}.each do |x|
  require x
end

# require judge and test setup files
%w{judge setup factories}.each do |x|
  require x
end