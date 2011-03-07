class ValidateMeGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("../templates", __FILE__)
 
  desc "This copies the validate_me jQuery plugin to your public/javascripts directory"
  def copy_initializer_file
    copy_file "jquery.validateMe.js", "public/javascripts/jquery.validateMe.js"
  end
end
