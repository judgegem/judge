Judge::Engine.routes.draw do
  get "/validate", :to => "validations#perform", :as => :perform_validation
end
