module Judge
  
  module Utils

    extend self

    MESSAGE_MAP = {
      :confirmation => { :base => :confirmation },
      :acceptance   => { :base => :accepted },
      :presence     => { :base => :blank },
      :length       => { :base => nil,
                         :options => {
                           :minimum => :too_short,
                           :maximum => :too_long,
                           :is      => :wrong_length    
                         }
                       },
      :format       => { :base => :invalid },
      :inclusion    => { :base => :inclusion },
      :exclusion    => { :base => :exclusion },
      :numericality => { :base => :not_a_number,
                         :options => {
                           :greater_than             => :greater_than, 
                           :greater_than_or_equal_to => :greater_than_or_equal_to, 
                           :equal_to                 => :equal_to, 
                           :less_than                => :less_than, 
                           :less_than_or_equal_to    => :less_than_or_equal_to,
                           :odd                      => :odd,
                           :even                     => :even
                         }
                       }
    }

    ALLOW_BLANK = [:format, :exclusion, :inclusion, :length]

    # Returns all decorated validators for an object's method, as JSON
    #   Judge::Utils.validators_to_json(@user, :name)
    def validators_to_json(object, method)
      validators = object.class.validators_on(method).reject { |validator| validator.kind == :uniqueness }
      validators.collect! do |validator| 
        Judge::Utils.decorate_validator(validator, object, method)
      end
      validators.to_json
    end
    
    # Convert validator to hash, removing all parts we don't support and adding all possible error messages
    #   Judge::Utils.decorate_validator(validator_instance, @user, :name)
    def decorate_validator(validator, object, method)
      kind = validator.kind
      mm = MESSAGE_MAP

      # remove callbacks and tokenizer, which we don't support
      validator_options = validator.options.reject { |key| [:if, :on, :unless, :tokenizer].include?(key)  }
      
      messages = {}
      if mm.has_key?(kind) && mm[kind][:base].present?
        base_message = mm[kind][:base]
        messages[base_message] = object.errors.generate_message(method, base_message, validator_options)
      end
      if mm.has_key?(kind) && mm[kind][:options].present?
        opt_messages = mm[kind][:options]
        opt_messages.each do |opt, opt_message|
          if validator_options.has_key?(opt)
            options_for_interpolation = { :count => validator_options[opt] }.merge(validator_options)
            messages[opt_message] = object.errors.generate_message(method, opt_message, options_for_interpolation)
          end
        end
      end
      if ALLOW_BLANK.include?(kind) && validator_options[:allow_blank].blank? && messages[:blank].blank?
        messages[:blank] = object.errors.generate_message(method, :blank)
      end
      if kind == :numericality && validator_options[:only_integer].present?
        messages[:not_an_integer] = object.errors.generate_message(method, :not_an_integer)
      end

      { :kind => kind, :options => validator_options, :messages => messages }
    end

  end
end
