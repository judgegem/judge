require 'singleton'

module Judge
  class Config
    include Singleton

    @@allowed = {}

    def allow(klass, *attributes)
      attrs = (@@allowed[klass] ||= [])
      attrs.concat(attributes).uniq!
    end

    def allowed
      @@allowed
    end

    def allows?(klass, attribute)
      @@allowed.has_key?(klass) && @@allowed[klass].include?(attribute)
    end

    def disallow(klass, *attributes)
      attributes.each do |a|
        @@allowed[klass].delete(a)
      end
      if attributes.empty? || @@allowed[klass].empty?
        @@allowed.delete(klass)
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