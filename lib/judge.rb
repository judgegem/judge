files = [
  'version',
  'config',
  'engine',
  'validator',
  'validator_collection',
  'message_collection',
  'html',
  'form_builder',
  'each_validator',
  'validation',
  'controller'
]
files.each { |filename| require "judge/#{filename}" }