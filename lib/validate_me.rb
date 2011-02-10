require File.dirname(__FILE__) + '/validate_me/helpers'

ActionView::Helpers::FormBuilder.extend(ValidateMe::Helpers)
