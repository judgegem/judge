module Judge

  class MessageCollection

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

    DEFAULT_OPTS = { :generate => true }

    attr_reader   :object, :method, :kind, :options, :mm
    attr_accessor :messages

    def initialize(object, method, amv, opts = {})
      opts = DEFAULT_OPTS.merge(opts)
      @object   = object
      @method   = method
      @kind     = amv.kind
      @options  = amv.options.dup
      @mm       = MESSAGE_MAP
      @messages = {}
      generate_messages! unless opts[:generate] == false
    end

    def generate_messages!
      if messages.blank?
        %w{base options blank integer}.each do |type|
          self.send(:"generate_#{type}!")
        end
      end
    end

    def to_hash
      messages
    end

    private

    def generate_base!
      if mm.has_key?(kind) && mm[kind][:base].present?
        base_message = mm[kind][:base]
        messages[base_message] = object.errors.generate_message(method, base_message, options)
      end
    end

    def generate_options!
      if mm.has_key?(kind) && mm[kind][:options].present?
        opt_messages = mm[kind][:options]
        opt_messages.each do |opt, opt_message|
          if options.has_key?(opt)
            options_for_interpolation = { :count => options[opt] }.merge(options)
            messages[opt_message] = object.errors.generate_message(method, opt_message, options_for_interpolation)
          end
        end
      end
    end

    def generate_blank!
      if ALLOW_BLANK.include?(kind) && options[:allow_blank].blank? && messages[:blank].blank?
        messages[:blank] = object.errors.generate_message(method, :blank)
      end
    end

    def generate_integer!
      if kind == :numericality && options[:only_integer].present?
        messages[:not_an_integer] = object.errors.generate_message(method, :not_an_integer)
      end
    end

  end

end