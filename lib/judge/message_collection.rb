require 'message_config'

module Judge

  class MessageCollection

    include MessageConfig

    attr_reader   :object, :method, :kind, :options
    attr_accessor :messages

    def initialize(object, method, amv)
      @object   = object
      @method   = method
      @kind     = amv.kind
      @options  = amv.options.dup
      @messages = generate_messages
    end

    def generate_messages
      %w{base options blank integer}.inject({}) do |messages, type|
        messages.merge(self.send(:"generate_#{type}"))
      end
    end

    def to_hash
      messages
    end

    private

    def generate_base
      messages = {}
      if MESSAGE_MAP.has_key?(kind) && MESSAGE_MAP[kind][:base].present?
        base_message = MESSAGE_MAP[kind][:base]
        messages[base_message] = object.errors.generate_message(method, base_message, options)
      end
      messages
    end

    def generate_options
      messages = {}
      if MESSAGE_MAP.has_key?(kind) && MESSAGE_MAP[kind][:options].present?
        opt_messages = MESSAGE_MAP[kind][:options]
        opt_messages.each do |opt, opt_message|
          if options.has_key?(opt)
            options_for_interpolation = { :count => options[opt] }.merge(options)
            messages[opt_message] = object.errors.generate_message(method, opt_message, options_for_interpolation)
          end
        end
      end
      messages
    end

    def generate_blank
      messages = {}
      if ALLOW_BLANK.include?(kind) && options[:allow_blank].blank? && messages[:blank].blank?
        messages[:blank] = object.errors.generate_message(method, :blank)
      end
      messages
    end

    def generate_integer
      messages = {}
      if kind == :numericality && options[:only_integer].present?
        messages[:not_an_integer] = object.errors.generate_message(method, :not_an_integer)
      end
      messages
    end

  end

end