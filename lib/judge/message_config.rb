module Judge

  module MessageConfig

    ALLOW_BLANK = [
      :format,
      :exclusion,
      :inclusion,
      :length
    ]

    MESSAGE_MAP = {
      :confirmation => { :base => :confirmation },
      :acceptance   => { :base => :accepted },
      :presence     => { :base => :blank },
      :length       => { :base => nil,
                         :options => {
                           :minimum => :too_short,
                           :maximum => :too_long,
                           :is      => :wrong_length    
                         }
                       },
      :format       => { :base => :invalid },
      :inclusion    => { :base => :inclusion },
      :exclusion    => { :base => :exclusion },
      :numericality => { :base => :not_a_number,
                         :options => {
                           :greater_than             => :greater_than, 
                           :greater_than_or_equal_to => :greater_than_or_equal_to, 
                           :equal_to                 => :equal_to, 
                           :less_than                => :less_than, 
                           :less_than_or_equal_to    => :less_than_or_equal_to,
                           :odd                      => :odd,
                           :even                     => :even
                         }
                       },
      :uniqueness   => { :base => :taken }
    }

  end

end