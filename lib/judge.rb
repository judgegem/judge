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
  'controller',
  'confirmation_validator'
]
files.each { |filename| require "judge/#{filename}" }