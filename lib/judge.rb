require File.dirname(__FILE__) + '/judge/utils'
require File.dirname(__FILE__) + '/judge/form'

::ActionView::Helpers::FormBuilder.send(:include, Judge::FormBuilder)

module ApplicationHelper
  include Judge::FormHelper
end
