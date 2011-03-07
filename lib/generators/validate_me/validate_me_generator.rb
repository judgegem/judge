class ValidateMeGenerator < Rails::Generators::Base
  source_root File.expand_path("../templates", __FILE__)
  argument :path, :type => :string, :default => "public/javascripts"
  class_option :example, :type => :boolean, :default => true, :description => "Copy example jQuery element bindings"
 
  desc "This copies the validate_me jQuery plugin to your public/javascripts directory"
  def copy_initializer_file
    copy_file "jquery.validateMe.js", "#{path}/jquery.validateMe.js"
    copy_file "example.validateMe.js", "#{path}/example.validateMe.js" if options.example?
  end
end
