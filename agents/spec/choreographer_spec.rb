$: << File.dirname(__FILE__)+'/..'
$: << File.dirname(__FILE__)+'/../sail.rb/lib'

require 'mongo'
require 'choreographer'
require 'speccer'

require 'spec/support/xmpp'


describe Choreographer do
  include_context :xmpp
  
  it "should go through day 1 as per sequence diagram" do
    @spec.config[:nickname] = "PeterBelk"
    
    @spec.class_eval do
      def behaviour
        default_behaviour
        
        someone_joined_room do |stanza|
          if Sail::Agent::Util.extract_login(stanza.from) == "Choreographer"
            start_chain
              ev(:check_in, {:location => "room"})
              wait 'ORIENTATION'
              expect_student{ self.state.should == :ORIENTATION }
              ev(:observations_start, {})
              wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              expect_student{ self.current_locations.length == 4 }
              
              # ROTATION I
              4.times do
                on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
                wait('GOING_TO_ASSIGNED_LOCATION')
                ev(:check_in, lambda{{:location => @assigned_location}})
                wait('OBSERVING_PAST')
                ev(:organism_observation, 
                  lambda{{"location" => @assigned_location, "team_name" => "Darwin","assigned_organism" => "fig_tree","observed_organism" => "fig_tree","time" => "200 mya"}})
                wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              end
              
              # MEETUP I
              on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
              wait('GOING_TO_ASSIGNED_LOCATION')
              expect_student{ self.metadata.current_task.should == 'meetup'}
              ev(:check_in, lambda{{:location => @assigned_location}})
              wait('WAITING_FOR_MEETUP_TOPIC')
              
              finish
            end_chain
          end
        end
        
        # event :state_change? do |stanza, data|
        #           case data['payload']['to']
        #             when 'ORIENTATION'
        #               
        #           end 
        #         end
      end
    end
        
    @chor.spawn!
    @spec.spawn!
    
    EM.run {
      @chor.run
      @spec.run
    }
  end
end