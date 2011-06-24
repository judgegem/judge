class FoosController < ApplicationController
  def new
    @foo = Foo.new
  end
end
