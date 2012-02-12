$: << File.dirname(__FILE__)+'/..'
$: << File.dirname(__FILE__)+'/../sail.rb/lib'

require 'mongo'
require 'choreographer'
require 'speccer'

require 'spec/support/xmpp'


describe Choreographer do
  include_context :xmpp
  
  before do
    @chor = Choreographer.new(:room => RUN, :password => AGENT_PASSWORD, :database => TEST_DB)
    @chor.config[:host] = XMPP_HOST
    @chor.config[:port] = XMPP_PORT
    @chor.config[:sail] = SAIL_CONFIG
    @chor.log_to = File.open(File.dirname(__FILE__)+'/../logs/Choreographer.log','w')
    
    @chor.class_eval do
      include(EventExpectations)
    end
    
    @chor.catch_event_exceptions = false
    @spec.catch_event_exceptions = false
    
    @spec.chor = @chor
  end
  
  it "should go through day 1 as per sequence diagram" do
    @spec.config[:nickname] = "bobby"
    
    @spec.class_eval do
      def behaviour
        default_behaviour
        
        someone_joined_room do |stanza|
          if Sail::Agent::Util.extract_login(stanza.from) == "Choreographer"
            sequence do
              ev(:check_in, {:location => "room"})
              wait('ORIENTATION')
              expect_student{ self.state.should == :ORIENTATION }
              ev(:observations_start, {}, {:origin => 'ateacher'})
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
              wait('WAITING_FOR_MEETUP_START')
              
              ev(:meetup_start, {}, {:origin => 'ateacher'})
              wait("MEETUP")
              
              ev(:note, {
                "author" => "JoeMcStudent",
                "team_name" => "Darwin",
                "meetup" => "1",
                "note" => "Blah blah blah...",
                "specialty" => "primates"
              })
              
              wait("WAITING_FOR_GROUP_TO_FINISH_MEETUP")
              ev(:observations_start, {}, {:origin => 'ateacher'})
              wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              expect_student{ self.current_locations.length == 4 }
              
              # ROTATION II
              4.times do
                on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
                wait('GOING_TO_ASSIGNED_LOCATION')
                ev(:check_in, lambda{{:location => @assigned_location}})
                wait('OBSERVING_PAST')
                ev(:organism_observation, 
                  lambda{{"location" => @assigned_location, "team_name" => "Darwin","assigned_organism" => "fig_tree","observed_organism" => "fig_tree","time" => "200 mya"}})
                wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              end
              
               # MEETUP II
                on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
                wait('GOING_TO_ASSIGNED_LOCATION')
                expect_student{ self.metadata.current_task.should == 'meetup'}
                ev(:check_in, lambda{{:location => @assigned_location}})
                wait('WAITING_FOR_MEETUP_START')

                ev(:meetup_start, {}, {:origin => 'ateacher'})
                wait("MEETUP")

                ev(:note, {
                  "author" => "JoeMcStudent",
                  "team_name" => "Darwin",
                  "meetup" => "1",
                  "note" => "Blah blah blah...",
                  "specialty" => "primates"
                })

                wait("WAITING_FOR_GROUP_TO_FINISH_MEETUP")
                ev(:homework_assignment, {}, {:origin => 'ateacher'})
              
              finish
            end
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