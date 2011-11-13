require "action_view/test_case"
require "html/document"
require "expected_elements"

class JudgeFormBuilderTest < ActionView::TestCase

  include ExpectedElements

  def test_text_field
    assert_dom_equal expected_text_field, builder.text_field(:name, :validate => true)
  end

  def test_text_area
    assert_dom_equal expected_text_area, builder.text_area(:bio, :validate => true)
  end

  def test_password_field
    assert_dom_equal expected_password_field, builder.password_field(:password, :validate => true)
  end

  def test_check_box
    assert_dom_equal expected_check_box, builder.password_field(:accepted, :validate => true)
  end

  def test_radio_button
    assert_dom_equal expected_radio_button, builder.radio_button(:gender, "female", :validate => true)
  end

  def test_select
    assert_dom_equal expected_select, builder.select(:country, [["US", "US"], ["GB", "GB"]], :validate => true)
  end

  def test_collection_select
    assert_dom_equal expected_collection_select, builder.collection_select(:team_id, FactoryGirl.create_list(:team, 5), :id, :name, :validate => true)
  end

  def test_grouped_collection_select
    assert_dom_equal expected_grouped_collection_select, builder.grouped_collection_select(:discipline_id, categories, :sports, :name, :id, :name, :validate => true)
  end

  def test_date_select
    assert_dom_equal expected_date_select, builder.date_select(:dob, :validate => true, :minute_step => 30)
  end

  def test_datetime_select
    assert_dom_equal expected_datetime_select, builder.datetime_select(:dob, :validate => true, :minute_step => 30)
  end

  def test_time_select
    assert_dom_equal expected_time_select, builder.time_select(:dob, :validate => true, :minute_step => 30)
  end

  def test_time_zone_select
    assert_dom_equal expected_time_zone_select, builder.time_zone_select(:time_zone, ActiveSupport::TimeZone.us_zones, :include_blank => true, :validate => true)
  end

  def builder
    Judge::FormBuilder.new(:user, FactoryGirl.build(:user), self, {}, nil)
  end

  def categories
    category = FactoryGirl.build(:category)
    sport = FactoryGirl.build(:sport)
    sport.disciplines << FactoryGirl.build_list(:discipline, 3)
    category.sports << sport
    [category]
  end

end