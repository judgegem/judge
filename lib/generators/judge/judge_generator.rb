class JudgeGenerator < Rails::Generators::Base
  source_root File.expand_path("../templates", __FILE__)
  argument :path, :type => :string, :default => "public/javascripts"
  class_option :store, :type => :boolean, :default => false, :desc => "Install judge-store.js"
  class_option :underscore, :type => :boolean, :default => false, :desc => "Install underscore.js"
  class_option :json2, :type => :boolean, :default => false, :desc => "Install json2.js"
 
  desc %Q{
This copies judge-core.js to your application.
The default path is public/javascripts, but you can set your own as follows:

  rails generate judge my/super/cool/path

Use the --underscore and --json2 options to also install the hard dependencies (if you don't have them already).

  rails generate judge --underscore --json2

Use the --store option to also install judge-store.js, a storage extension.

  rails generate judge --store
  }
  def copy_files
    copy_file "judge-core.js", "#{path}/judge-core.js"
    if options.underscore?
      copy_file "underscore.js", "#{path}/underscore.js"
    end
    if options.json2?
      copy_file "json2.js", "#{path}/json2.js"
    end
    if options.store?
      copy_file "judge-store.js", "#{path}/judge-store.js"
    end
  end
end
