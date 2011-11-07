# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "judge/version"

Gem::Specification.new do |s|
  s.name = "judge"
  s.version = Judge::VERSION
  s.homepage = "http://github.com/joecorcoran/judge"
  s.license = "MIT"
  s.summary = %Q{Simple client side ActiveModel::Validators}
  s.description = %Q{Validate forms on the client side, cleanly}
  s.email = "joe@tribesports.com"
  s.authors = ["Joe Corcoran"]

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.require_paths = ["lib"]

  s.add_development_dependency "jasmine",       "~> 1.0.2"
  s.add_development_dependency "rails",         "~> 3.0.10"
  s.add_development_dependency "shoulda",       "~> 2.11.3"
  s.add_development_dependency "sqlite3-ruby",  "~> 1.3.2"
  s.add_development_dependency "factory_girl",  "~> 2.2.0"
end
