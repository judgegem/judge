require File.dirname(__FILE__) + '/judge/helpers'

::ActionView::Helpers::FormBuilder.send(:include, Judge::FieldHelpers)
::ActionView::Helpers::FormHelper.send(:include, Judge::FormHelpers)
