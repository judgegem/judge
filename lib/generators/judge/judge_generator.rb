class JudgeGenerator < Rails::Generators::Base
  source_root File.expand_path("../templates", __FILE__)
  argument :path, :type => :string, :default => "public/javascripts"
  class_option :dep, :type => :boolean, :default => true, :desc => "Copy underscore.js and json2.js"
 
  desc %Q{
This copies judge.js (and dependencies) to your application.
The default path is public/javascripts, but you can set your own as follows:

  rails generate judge my/super/cool/path

Use the --no-dep option if you don't want to copy underscore.js and json2.js too.
  }
  def copy_files
    copy_file "judge.js", "#{path}/judge.js"
    if options.dep?
      copy_file "underscore.js", "#{path}/underscore.js"
      copy_file "json2.js", "#{path}/json2.js"
    end
  end
end
