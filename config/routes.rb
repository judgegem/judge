Judge::Engine.routes.draw do
  match "/validations/uniqueness" => "validations#uniqueness"  
end
