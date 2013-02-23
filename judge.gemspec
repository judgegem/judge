$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "judge/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name = "judge"
  s.version = Judge::VERSION
  s.homepage = "http://github.com/joecorcoran/judge"
  s.summary = "Simple client side ActiveModel::Validators"
  s.description = "Validate Rails 3 forms on the client side, cleanly"
  s.email = "joecorcoran@gmail.com"
  s.authors = ["Joe Corcoran"]

  s.files = Dir["{app,config,lib,vendor}/**/*"] + ["LICENSE.txt", "Rakefile", "README.md"]

  s.add_development_dependency "sqlite3"
  s.add_development_dependency "jasmine",            "~> 1.1.2"
  s.add_development_dependency "rails",              "~> 3.1"
  s.add_development_dependency "rspec-rails",        "~> 2.9"
  s.add_development_dependency "jquery-rails"
  s.add_development_dependency "sqlite3",            "~> 1.3.5"
  s.add_development_dependency "factory_girl",       "~> 2.6"
  s.add_development_dependency "appraisal",          "~> 0.4.1"
end
