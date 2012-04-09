class FooValidator < ActiveModel::EachValidator
  declare_messages :not_foo, "must_be_a_foo"
end