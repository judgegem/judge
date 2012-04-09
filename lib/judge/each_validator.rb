module Judge
  module EachValidator

    def self.included(base)
      base.send(:extend, ClassMethods)
    end

    module ClassMethods

      def declare_messages(*keys)
        send :define_method, :messages_to_lookup do
          keys
        end
      end

    end

  end
end

::ActiveModel::EachValidator.send(:include, Judge::EachValidator) if defined?(::ActiveModel::EachValidator)