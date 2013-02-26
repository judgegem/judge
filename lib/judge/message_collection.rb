require "judge/message_config"

module Judge

  class MessageCollection

    include MessageConfig

    attr_reader   :object, :method, :amv, :kind, :options

    def initialize(object, method, amv)
      @object   = object
      @method   = method
      @amv      = amv
      @kind     = amv.kind
      @options  = amv.options.dup
      @messages = {}
      generate_messages!
    end

    def generate_messages!
      return if @kind == :uniqueness
      %w{base options integer custom blank}.each do |type|
        @messages = @messages.merge(self.send(:"#{type}_messages"))
      end
    end

    def to_hash
      @messages
    end

    def custom_messages?
      amv.respond_to?(:messages_to_lookup) && amv.messages_to_lookup.present?
    end

    private

    def base_messages
      msgs = {}
      if MESSAGE_MAP.has_key?(kind) && MESSAGE_MAP[kind][:base].present?
        base_message = MESSAGE_MAP[kind][:base]
        msgs[base_message] = object.errors.generate_message(method, base_message, options)
      end
      msgs
    end

    def options_messages
      msgs = {}
      if MESSAGE_MAP.has_key?(kind) && MESSAGE_MAP[kind][:options].present?
        opt_messages = MESSAGE_MAP[kind][:options]
        opt_messages.each do |opt, opt_message|
          if options.has_key?(opt)
            options_for_interpolation = { :count => options[opt] }.merge(options)
            msgs[opt_message] = object.errors.generate_message(method, opt_message, options_for_interpolation)
          end
        end
      end
      msgs
    end

    def blank_messages
      msgs = {}
      if ALLOW_BLANK.include?(kind) && options[:allow_blank].blank? && @messages[:blank].blank?
        msgs[:blank] = object.errors.generate_message(method, :blank)
      end
      msgs
    end

    def integer_messages
      msgs = {}
      if kind == :numericality && options[:only_integer].present?
        msgs[:not_an_integer] = object.errors.generate_message(method, :not_an_integer)
      end
      msgs
    end

    def custom_messages
      msgs = {}
      if custom_messages?
        amv.messages_to_lookup.each do |key|
          msgs[key.to_sym] = object.errors.generate_message(method, key)
        end
      end
      msgs
    end

  end

end