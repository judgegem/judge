# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "judge/version"

Gem::Specification.new do |s|
  s.name = "judge"
  s.version = Judge::VERSION
  s.homepage = "http://github.com/joecorcoran/judge"
  s.summary = "Simple client side ActiveModel::Validators"
  s.description = "Validate Rails 3 forms on the client side, cleanly"
  s.email = "joe@tribesports.com"
  s.authors = ["Joe Corcoran"]

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- spec/*`.split("\n")
  s.require_paths = ["lib"]

  s.add_development_dependency "jasmine",            "~> 1.1.2"
  s.add_development_dependency "rails",              "~> 3.2"
  s.add_development_dependency "rspec",              "~> 2.8"
  s.add_development_dependency "sqlite3-ruby",       "~> 1.3.3"
  s.add_development_dependency "factory_girl",       "~> 2.6"
end
