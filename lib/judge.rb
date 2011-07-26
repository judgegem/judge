require File.dirname(__FILE__) + '/judge/utils'
require File.dirname(__FILE__) + '/judge/form'

::ActionView::Helpers::FormBuilder.send(:include, Judge::FormBuilder)
::ApplicationHelper.send(:include, Judge::FormHelper)
