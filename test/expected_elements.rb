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

  def expected_time_zone_select
    %Q{<select data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" id="user_time_zone" name="user[time_zone]"><option value=""></option>
<option value="Hawaii">(GMT-10:00) Hawaii</option>
<option value="Alaska">(GMT-09:00) Alaska</option>
<option value="Pacific Time (US &amp; Canada)">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
<option value="Arizona">(GMT-07:00) Arizona</option>
<option value="Mountain Time (US &amp; Canada)">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
<option value="Central Time (US &amp; Canada)">(GMT-06:00) Central Time (US &amp; Canada)</option>
<option value="Eastern Time (US &amp; Canada)">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
<option value="Indiana (East)">(GMT-05:00) Indiana (East)</option><option value="" disabled="disabled">-------------</option>
<option value="International Date Line West">(GMT-11:00) International Date Line West</option>
<option value="Midway Island">(GMT-11:00) Midway Island</option>
<option value="Samoa">(GMT-11:00) Samoa</option>
<option value="Tijuana">(GMT-08:00) Tijuana</option>
<option value="Chihuahua">(GMT-07:00) Chihuahua</option>
<option value="Mazatlan">(GMT-07:00) Mazatlan</option>
<option value="Central America">(GMT-06:00) Central America</option>
<option value="Guadalajara">(GMT-06:00) Guadalajara</option>
<option value="Mexico City">(GMT-06:00) Mexico City</option>
<option value="Monterrey">(GMT-06:00) Monterrey</option>
<option value="Saskatchewan">(GMT-06:00) Saskatchewan</option>
<option value="Bogota">(GMT-05:00) Bogota</option>
<option value="Lima">(GMT-05:00) Lima</option>
<option value="Quito">(GMT-05:00) Quito</option>
<option value="Caracas">(GMT-04:30) Caracas</option>
<option value="Atlantic Time (Canada)">(GMT-04:00) Atlantic Time (Canada)</option>
<option value="Georgetown">(GMT-04:00) Georgetown</option>
<option value="La Paz">(GMT-04:00) La Paz</option>
<option value="Santiago">(GMT-04:00) Santiago</option>
<option value="Newfoundland">(GMT-03:30) Newfoundland</option>
<option value="Brasilia">(GMT-03:00) Brasilia</option>
<option value="Buenos Aires">(GMT-03:00) Buenos Aires</option>
<option value="Greenland">(GMT-03:00) Greenland</option>
<option value="Mid-Atlantic">(GMT-02:00) Mid-Atlantic</option>
<option value="Azores">(GMT-01:00) Azores</option>
<option value="Cape Verde Is.">(GMT-01:00) Cape Verde Is.</option>
<option value="Casablanca">(GMT+00:00) Casablanca</option>
<option value="Dublin">(GMT+00:00) Dublin</option>
<option value="Edinburgh">(GMT+00:00) Edinburgh</option>
<option value="Lisbon">(GMT+00:00) Lisbon</option>
<option value="London">(GMT+00:00) London</option>
<option value="Monrovia">(GMT+00:00) Monrovia</option>
<option value="UTC">(GMT+00:00) UTC</option>
<option value="Amsterdam">(GMT+01:00) Amsterdam</option>
<option value="Belgrade">(GMT+01:00) Belgrade</option>
<option value="Berlin">(GMT+01:00) Berlin</option>
<option value="Bern">(GMT+01:00) Bern</option>
<option value="Bratislava">(GMT+01:00) Bratislava</option>
<option value="Brussels">(GMT+01:00) Brussels</option>
<option value="Budapest">(GMT+01:00) Budapest</option>
<option value="Copenhagen">(GMT+01:00) Copenhagen</option>
<option value="Ljubljana">(GMT+01:00) Ljubljana</option>
<option value="Madrid">(GMT+01:00) Madrid</option>
<option value="Paris">(GMT+01:00) Paris</option>
<option value="Prague">(GMT+01:00) Prague</option>
<option value="Rome">(GMT+01:00) Rome</option>
<option value="Sarajevo">(GMT+01:00) Sarajevo</option>
<option value="Skopje">(GMT+01:00) Skopje</option>
<option value="Stockholm">(GMT+01:00) Stockholm</option>
<option value="Vienna">(GMT+01:00) Vienna</option>
<option value="Warsaw">(GMT+01:00) Warsaw</option>
<option value="West Central Africa">(GMT+01:00) West Central Africa</option>
<option value="Zagreb">(GMT+01:00) Zagreb</option>
<option value="Athens">(GMT+02:00) Athens</option>
<option value="Bucharest">(GMT+02:00) Bucharest</option>
<option value="Cairo">(GMT+02:00) Cairo</option>
<option value="Harare">(GMT+02:00) Harare</option>
<option value="Helsinki">(GMT+02:00) Helsinki</option>
<option value="Istanbul">(GMT+02:00) Istanbul</option>
<option value="Jerusalem">(GMT+02:00) Jerusalem</option>
<option value="Pretoria">(GMT+02:00) Pretoria</option>
<option value="Riga">(GMT+02:00) Riga</option>
<option value="Sofia">(GMT+02:00) Sofia</option>
<option value="Tallinn">(GMT+02:00) Tallinn</option>
<option value="Vilnius">(GMT+02:00) Vilnius</option>
<option value="Baghdad">(GMT+03:00) Baghdad</option>
<option value="Kuwait">(GMT+03:00) Kuwait</option>
<option value="Kyiv">(GMT+03:00) Kyiv</option>
<option value="Minsk">(GMT+03:00) Minsk</option>
<option value="Nairobi">(GMT+03:00) Nairobi</option>
<option value="Riyadh">(GMT+03:00) Riyadh</option>
<option value="Tehran">(GMT+03:30) Tehran</option>
<option value="Abu Dhabi">(GMT+04:00) Abu Dhabi</option>
<option value="Baku">(GMT+04:00) Baku</option>
<option value="Moscow">(GMT+04:00) Moscow</option>
<option value="Muscat">(GMT+04:00) Muscat</option>
<option value="St. Petersburg">(GMT+04:00) St. Petersburg</option>
<option value="Tbilisi">(GMT+04:00) Tbilisi</option>
<option value="Volgograd">(GMT+04:00) Volgograd</option>
<option value="Yerevan">(GMT+04:00) Yerevan</option>
<option value="Kabul">(GMT+04:30) Kabul</option>
<option value="Islamabad">(GMT+05:00) Islamabad</option>
<option value="Karachi">(GMT+05:00) Karachi</option>
<option value="Tashkent">(GMT+05:00) Tashkent</option>
<option value="Chennai">(GMT+05:30) Chennai</option>
<option value="Kolkata">(GMT+05:30) Kolkata</option>
<option value="Mumbai">(GMT+05:30) Mumbai</option>
<option value="New Delhi">(GMT+05:30) New Delhi</option>
<option value="Sri Jayawardenepura">(GMT+05:30) Sri Jayawardenepura</option>
<option value="Kathmandu">(GMT+05:45) Kathmandu</option>
<option value="Almaty">(GMT+06:00) Almaty</option>
<option value="Astana">(GMT+06:00) Astana</option>
<option value="Dhaka">(GMT+06:00) Dhaka</option>
<option value="Ekaterinburg">(GMT+06:00) Ekaterinburg</option>
<option value="Rangoon">(GMT+06:30) Rangoon</option>
<option value="Bangkok">(GMT+07:00) Bangkok</option>
<option value="Hanoi">(GMT+07:00) Hanoi</option>
<option value="Jakarta">(GMT+07:00) Jakarta</option>
<option value="Novosibirsk">(GMT+07:00) Novosibirsk</option>
<option value="Beijing">(GMT+08:00) Beijing</option>
<option value="Chongqing">(GMT+08:00) Chongqing</option>
<option value="Hong Kong">(GMT+08:00) Hong Kong</option>
<option value="Krasnoyarsk">(GMT+08:00) Krasnoyarsk</option>
<option value="Kuala Lumpur">(GMT+08:00) Kuala Lumpur</option>
<option value="Perth">(GMT+08:00) Perth</option>
<option value="Singapore">(GMT+08:00) Singapore</option>
<option value="Taipei">(GMT+08:00) Taipei</option>
<option value="Ulaan Bataar">(GMT+08:00) Ulaan Bataar</option>
<option value="Urumqi">(GMT+08:00) Urumqi</option>
<option value="Irkutsk">(GMT+09:00) Irkutsk</option>
<option value="Osaka">(GMT+09:00) Osaka</option>
<option value="Sapporo">(GMT+09:00) Sapporo</option>
<option value="Seoul">(GMT+09:00) Seoul</option>
<option value="Tokyo">(GMT+09:00) Tokyo</option>
<option value="Adelaide">(GMT+09:30) Adelaide</option>
<option value="Darwin">(GMT+09:30) Darwin</option>
<option value="Brisbane">(GMT+10:00) Brisbane</option>
<option value="Canberra">(GMT+10:00) Canberra</option>
<option value="Guam">(GMT+10:00) Guam</option>
<option value="Hobart">(GMT+10:00) Hobart</option>
<option value="Melbourne">(GMT+10:00) Melbourne</option>
<option value="Port Moresby">(GMT+10:00) Port Moresby</option>
<option value="Sydney">(GMT+10:00) Sydney</option>
<option value="Yakutsk">(GMT+10:00) Yakutsk</option>
<option value="New Caledonia">(GMT+11:00) New Caledonia</option>
<option value="Vladivostok">(GMT+11:00) Vladivostok</option>
<option value="Auckland">(GMT+12:00) Auckland</option>
<option value="Fiji">(GMT+12:00) Fiji</option>
<option value="Kamchatka">(GMT+12:00) Kamchatka</option>
<option value="Magadan">(GMT+12:00) Magadan</option>
<option value="Marshall Is.">(GMT+12:00) Marshall Is.</option>
<option value="Solomon Is.">(GMT+12:00) Solomon Is.</option>
<option value="Wellington">(GMT+12:00) Wellington</option>
<option value="Nuku'alofa">(GMT+13:00) Nuku'alofa</option></select>}
  end

end