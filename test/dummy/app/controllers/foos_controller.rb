class FoosController < ApplicationController
  def new
    @foo = Foo.new

    continent = Continent.new(:id => 1, :name => "Europe")
    country = Country.new(:id => 1, :name => "Germany")
    country.cities << City.new(:id => 1, :name => "Hamburg")
    continent.countries << country
    @continents = [continent]
  end
end
