files = [
  'version',
  'config',
  'engine',
  'validator',
  'validator_collection',
  'message_collection',
  'form_builder',
  'each_validator',
  'controller',
]
files.each { |filename| require "judge/#{filename}" }