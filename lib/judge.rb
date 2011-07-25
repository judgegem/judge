require File.dirname(__FILE__) + '/judge/utils'
require File.dirname(__FILE__) + '/judge/form'

::ActionView::Helpers::FormBuilder.send(:include, Judge::FormBuilder)
::ActionView::Helpers::FormHelper.send(:include, Judge::FormHelper)
