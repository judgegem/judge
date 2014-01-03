$:.push File.expand_path('../lib', __FILE__)

require 'judge/version'

Gem::Specification.new do |s|
  s.name = 'judge'
  s.version = Judge::VERSION
  s.homepage = 'http://github.com/joecorcoran/judge'
  s.summary = 'Client side validation for Rails'
  s.description = 'Validate Rails 3 forms on the client side, simply'
  s.email = 'joecorcoran@gmail.com'
  s.authors = ['Joe Corcoran']
  s.files = Dir['{app,config,lib,vendor}/**/*'] + ['LICENSE.txt', 'README.md']

  s.add_runtime_dependency     'rails',              '>= 3.1'    

  s.add_development_dependency 'rspec-rails',            '~> 2.13'
  s.add_development_dependency 'rspec-extra-formatters', '~> 1.0'
  s.add_development_dependency 'jquery-rails'
  s.add_development_dependency 'sqlite3',                '~> 1.3.7'
  s.add_development_dependency 'factory_girl',           '~> 2.6'
  s.add_development_dependency 'appraisal',              '~> 0.5.1'
end
