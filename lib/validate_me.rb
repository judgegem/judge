require File.dirname(__FILE__) + '/validate_me/helpers'

::ActionView::Helpers::FormBuilder.send(:include, ValidateMe::FieldHelpers)
::ActionView::Helpers::FormHelper.send(:include, ValidateMe::FormHelpers)
