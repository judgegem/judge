class JudgeGenerator < Rails::Generators::Base
  source_root File.expand_path("../templates", __FILE__)
  argument :path, :type => :string, :default => "public/javascripts"
 
  desc %Q{
    This copies the judge JavaScript file to your application.
    The default path is public/javascripts, but you can set your own as follows:

      rails generate judge my/super/cool/path
  }
  def copy_files
    copy_file "judge.js", "#{path}/judge.js"
  end
end
