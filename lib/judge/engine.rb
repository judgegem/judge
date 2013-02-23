module Judge
  class Engine < ::Rails::Engine
    isolate_namespace Judge
    config.generators do |g|
      g.test_framework :rspec
    end
  end
end
