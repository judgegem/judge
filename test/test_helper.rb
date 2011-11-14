require "bundler/setup"

# require stuff
%w{active_record action_view shoulda factory_girl}.each do |x|
  require x
end

# require judge and test setup files
%w{judge setup factories}.each do |x|
  require x
end