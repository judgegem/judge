module Judge
  module EachValidator

    require 'set'

    def self.included(base)
      base.send(:cattr_accessor, :messages_to_lookup) { Set.new }
      base.send(:extend, ClassMethods)
    end

    module ClassMethods

      def uses_messages(*keys)
        self.messages_to_lookup.merge(keys)
      end

    end

  end
end

::ActiveModel::EachValidator.send(:include, Judge::EachValidator) if defined?(::ActiveModel::EachValidator)