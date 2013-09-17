require 'singleton'

module Judge
  class Config
    include Singleton

    @@exposed = {}

    cattr_accessor :ignore_unsupported_validators

    def expose(klass, *attributes)
      attrs = (@@exposed[klass] ||= [])
      attrs.concat(attributes).uniq!
    end

    def exposed
      @@exposed
    end

    def exposed?(klass, attribute)
      @@exposed.has_key?(klass) && @@exposed[klass].include?(attribute)
    end

    def unexpose(klass, *attributes)
      attributes.each do |a|
        @@exposed[klass].delete(a)
      end
      if attributes.empty? || @@exposed[klass].empty?
        @@exposed.delete(klass)
      end
    end
  end

  def self.config
    Config.instance
  end

  def self.configure(&block)
    Config.instance.instance_eval(&block)
  end
end