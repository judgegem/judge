Judge::Engine.routes.draw do
  root :to => "validations#index", :as => :validations, :via => :get
end
