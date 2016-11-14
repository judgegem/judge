require 'singleton'

module Judge
  class Config
    include Singleton

    @@exposed = {}
    @@ignore_unsupported_validators = false

    def expose(klass, *attributes)
      attrs = (@@exposed[klass.name] ||= [])
      attrs.concat(attributes).uniq!
    end

    def exposed
      @@exposed
    end

    def exposed?(klass, attribute)
      @@exposed.has_key?(klass.name) && @@exposed[klass.name].include?(attribute)
    end

    def unexpose(klass, *attributes)
      attributes.each do |a|
        @@exposed[klass.name].delete(a)
      end
      if attributes.empty? || @@exposed[klass.name].empty?
        @@exposed.delete(klass.name)
      end
    end
    
    def ignore_unsupported_validators(status)
      @@ignore_unsupported_validators = status
    end

    def ignore_unsupported_validators?
      @@ignore_unsupported_validators
    end
  end

  def self.config
    Config.instance
  end

  def self.configure(&block)
    Config.instance.instance_eval(&block)
  end
end
