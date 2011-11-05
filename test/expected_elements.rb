module ExpectedElements

	def expected_text_field
		%Q{<input 
				data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" 
				id="user_name" 
				name="user[name]" 
				size="30" 
				type="text" 
		/>}
	end

	def expected_text_area
		%Q{<textarea 
				cols="40" 
				data-validate="[{&quot;kind&quot;:&quot;presence&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;blank&quot;:&quot;can't be blank&quot;}}]" 
				id="user_bio" 
				name="user[bio]" 
				rows="20"
		></textarea>}
	end

	def expected_password_field
		%Q{<input 
				data-validate="[{&quot;kind&quot;:&quot;format&quot;,&quot;options&quot;:{&quot;with&quot;:&quot;(?-mix:.+)&quot;},&quot;messages&quot;:{&quot;invalid&quot;:&quot;is invalid&quot;,&quot;blank&quot;:&quot;can't be blank&quot;}},{&quot;kind&quot;:&quot;confirmation&quot;,&quot;options&quot;:{},&quot;messages&quot;:{&quot;confirmation&quot;:&quot;doesn't match confirmation&quot;}}]" 
				id="user_password" 
				name="user[password]" 
				size="30" 
				type="password" 
		/>}
	end

	def expected_check_box
		%Q{<input 
				data-validate="[{&quot;kind&quot;:&quot;acceptance&quot;,&quot;options&quot;:{&quot;allow_nil&quot;:true,&quot;accept&quot;:&quot;1&quot;},&quot;messages&quot;:{&quot;accepted&quot;:&quot;must be accepted&quot;}}]" 
				id="user_accepted" 
				name="user[accepted]" 
				size="30" 
				type="password" 
		/>}
	end

	def expected_radio_button
		%Q{<input 
				data-validate="[{&quot;kind&quot;:&quot;inclusion&quot;,&quot;options&quot;:{&quot;in&quot;:[&quot;male&quot;,&quot;female&quot;,&quot;other&quot;,&quot;withheld&quot;]},&quot;messages&quot;:{&quot;inclusion&quot;:&quot;is not included in the list&quot;,&quot;blank&quot;:&quot;can't be blank&quot;}}]" 
				id="user_gender_female" 
				name="user[gender]" 
				type="radio" 
				value="female" 
		/>}
	end

end