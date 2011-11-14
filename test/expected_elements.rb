module ExpectedElements
  
  def expected_text_field
   %Q{<input data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_name" name="user[name]" size="30" type="text" />}
  end

  def expected_text_area
    %Q{<textarea cols="40" data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_bio" name="user[bio]" rows="20"></textarea>}
  end

  def expected_password_field
    %Q{<input data-validate="[{&quot;kind&quot;:&quot;format&quot;,&quot;options&quot;:{&quot;with&quot;:&quot;(?-mix:.+)&quot;},&quot;messages&quot;:{&quot;invalid&quot;:&quot;is invalid&quot;,&quot;blank&quot;:&quot;can't be blank&quot;}},{&quot;kind&quot;:&quot;confirmation&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;confirmation&quot;:&quot;doesn't match confirmation&quot;}}]" id="user_password" name="user[password]" size="30" type="password" />}
  end

  def expected_check_box
    %Q{<input data-validate="[{&quot;kind&quot;:&quot;acceptance&quot;,&quot;options&quot;:{&quot;allow_nil&quot;:true,&quot;accept&quot;:&quot;1&quot;},&quot;messages&quot;:{&quot;accepted&quot;:&quot;must be accepted&quot;}}]" id="user_accepted" name="user[accepted]" size="30" type="password" />}
  end

  def expected_radio_button
    %Q{<input data-validate="[{&quot;kind&quot;:&quot;inclusion&quot;,&quot;options&quot;:{&quot;in&quot;:[&quot;male&quot;,&quot;female&quot;,&quot;other&quot;,&quot;withheld&quot;]},&quot;messages&quot;:{&quot;inclusion&quot;:&quot;is not included in the list&quot;,&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_gender_female" name="user[gender]" type="radio" value="female" />}
  end

  def expected_select
    %Q{<select data-validate="[{&quot;kind&quot;:&quot;format&quot;,&quot;options&quot;:{&quot;with&quot;:&quot;(?-mix:[A-Za-z])&quot;,&quot;allow_blank&quot;:true},&quot;messages&quot;:{&quot;invalid&quot;:&quot;is invalid&quot;}}]" id="user_country" name="user[country]"><option value="US">US</option>
<option value="GB">GB</option></select>}
  end

  def expected_collection_select
    %Q{<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_team_id" name="user[team_id]"><option value="1">Team 1</option>
<option value="2">Team 2</option>
<option value="3">Team 3</option>
<option value="4">Team 4</option>
<option value="5">Team 5</option></select>}
  end

  def expected_grouped_collection_select
    %Q{<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_discipline_id" name="user[discipline_id]"><optgroup label="Category 1"><option value="">Sport 1</option></optgroup></select>}
  end

  def expected_date_select
    %Q{<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_1i" name="user[dob(1i)]">
<option value="2006">2006</option>
<option value="2007">2007</option>
<option value="2008">2008</option>
<option value="2009">2009</option>
<option value="2010">2010</option>
<option selected="selected" value="2011">2011</option>
<option value="2012">2012</option>
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
<option value="2016">2016</option>
</select>
<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_2i" name="user[dob(2i)]">
<option value="1">January</option>
<option value="2">February</option>
<option value="3">March</option>
<option value="4">April</option>
<option value="5">May</option>
<option value="6">June</option>
<option value="7">July</option>
<option value="8">August</option>
<option value="9">September</option>
<option value="10">October</option>
<option selected="selected" value="11">November</option>
<option value="12">December</option>
</select>
<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_3i" name="user[dob(3i)]">
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option selected="selected" value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>
<option value="14">14</option>
<option value="15">15</option>
<option value="16">16</option>
<option value="17">17</option>
<option value="18">18</option>
<option value="19">19</option>
<option value="20">20</option>
<option value="21">21</option>
<option value="22">22</option>
<option value="23">23</option>
<option value="24">24</option>
<option value="25">25</option>
<option value="26">26</option>
<option value="27">27</option>
<option value="28">28</option>
<option value="29">29</option>
<option value="30">30</option>
<option value="31">31</option>
</select>
}
  end

  def expected_datetime_select
    %Q{<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_1i" name="user[dob(1i)]">
<option value="2006">2006</option>
<option value="2007">2007</option>
<option value="2008">2008</option>
<option value="2009">2009</option>
<option value="2010">2010</option>
<option selected="selected" value="2011">2011</option>
<option value="2012">2012</option>
<option value="2013">2013</option>
<option value="2014">2014</option>
<option value="2015">2015</option>
<option value="2016">2016</option>
</select>
<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_2i" name="user[dob(2i)]">
<option value="1">January</option>
<option value="2">February</option>
<option value="3">March</option>
<option value="4">April</option>
<option value="5">May</option>
<option value="6">June</option>
<option value="7">July</option>
<option value="8">August</option>
<option value="9">September</option>
<option value="10">October</option>
<option selected="selected" value="11">November</option>
<option value="12">December</option>
</select>
<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_3i" name="user[dob(3i)]">
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option selected="selected" value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
<option value="9">9</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>
<option value="14">14</option>
<option value="15">15</option>
<option value="16">16</option>
<option value="17">17</option>
<option value="18">18</option>
<option value="19">19</option>
<option value="20">20</option>
<option value="21">21</option>
<option value="22">22</option>
<option value="23">23</option>
<option value="24">24</option>
<option value="25">25</option>
<option value="26">26</option>
<option value="27">27</option>
<option value="28">28</option>
<option value="29">29</option>
<option value="30">30</option>
<option value="31">31</option>
</select>
 &mdash; <select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_4i" name="user[dob(4i)]">
<option value="00">00</option>
<option value="01">01</option>
<option value="02">02</option>
<option value="03">03</option>
<option value="04">04</option>
<option value="05">05</option>
<option value="06">06</option>
<option value="07">07</option>
<option value="08">08</option>
<option value="09">09</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>
<option value="14">14</option>
<option value="15">15</option>
<option value="16">16</option>
<option selected="selected" value="17">17</option>
<option value="18">18</option>
<option value="19">19</option>
<option value="20">20</option>
<option value="21">21</option>
<option value="22">22</option>
<option value="23">23</option>
</select>
 : <select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_5i" name="user[dob(5i)]">
<option selected="selected" value="00">00</option>
<option value="30">30</option>
</select>
}
  end

  def expected_time_select
    %Q{<input id="user_dob_1i" name="user[dob(1i)]" type="hidden" value="2011" />
<input id="user_dob_2i" name="user[dob(2i)]" type="hidden" value="11" />
<input id="user_dob_3i" name="user[dob(3i)]" type="hidden" value="5" />
<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_4i" name="user[dob(4i)]">
<option value="00">00</option>
<option value="01">01</option>
<option value="02">02</option>
<option value="03">03</option>
<option value="04">04</option>
<option value="05">05</option>
<option value="06">06</option>
<option value="07">07</option>
<option value="08">08</option>
<option value="09">09</option>
<option value="10">10</option>
<option value="11">11</option>
<option value="12">12</option>
<option value="13">13</option>
<option value="14">14</option>
<option value="15">15</option>
<option value="16">16</option>
<option selected="selected" value="17">17</option>
<option value="18">18</option>
<option value="19">19</option>
<option value="20">20</option>
<option value="21">21</option>
<option value="22">22</option>
<option value="23">23</option>
</select>
 : <select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_dob_5i" name="user[dob(5i)]">
<option selected="selected" value="00">00</option>
<option value="30">30</option>
</select>
}
  end

end