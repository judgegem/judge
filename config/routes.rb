Judge::Engine.routes.draw do
  root :to => "validations#build", :as => :build_validation, :via => :get
end
