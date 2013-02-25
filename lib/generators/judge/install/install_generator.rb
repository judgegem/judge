module Judge
  module Generators
    class InstallGenerator < ::Rails::Generators::Base

      desc %Q{For use where asset pipeline is disabled.
Installs judge.js and optionally installs underscore.js and json2.js.

Copy judge.js to public/javascripts:
  $ rails generate judge:install

Copy judge.js to different path:
  $ rails generate judge:install path

Copy judge.js and dependencies:
  $ rails generate judge:install path --underscore --json2
}

      argument :path, :type => :string, :default => "public/javascripts"
      class_option :underscore, :type => :boolean, :default => false, :desc => "Install underscore.js"
      class_option :json2, :type => :boolean, :default => false, :desc => "Install json2.js"
      source_root File.expand_path("../../../../..", __FILE__)

      def exec
        unless !::Rails.application.config.assets.enabled
          say_status("deprecated", "You don't need to use this generator as your app is running on Rails >= 3.1 with the asset pipeline enabled")
          return
        end
        say_status("copying", "judge.js", :green)
        copy_file("app/assets/javascripts/judge.js", "#{path}/judge.js")
        if options.underscore?
          say_status("copying", "underscore.js", :green)
          copy_file("vendor/assets/javascripts/underscore.js", "#{path}/underscore.js")
        end
        if options.json2?
          say_status("copying", "json2.js", :green)
          copy_file("vendor/assets/javascripts/json2.js", "#{path}/json2.js")
        end
      end

    end
  end
end