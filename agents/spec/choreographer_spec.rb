$: << File.dirname(__FILE__)+'/..'
$: << File.dirname(__FILE__)+'/../sail.rb/lib'

require 'mongo'
require 'choreographer'
require 'speccer'

require 'spec/support/xmpp'


describe Choreographer do
  include_context :xmpp
  
  before(:each) do
    @chor = Choreographer.new(:room => RUN, :password => AGENT_PASSWORD, :database => TEST_DB)
    @chor.config[:host] = XMPP_HOST
    @chor.config[:port] = XMPP_PORT
    @chor.config[:sail] = SAIL_CONFIG
    @chor.log_to = File.open(File.dirname(__FILE__)+'/../logs/Choreographer-rspec.log','w')
    
    @chor.class_eval do
      include(SpecHelpers)
    end
    
    @chor.catch_event_exceptions = false
    @spec.catch_event_exceptions = false
    
    @spec.chor = @chor
  end
  
  it "should go through DAY 1 as per sequence diagram" do
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
              ev(:observations_start, {:rotation => 1}, {:origin => 'ateacher'})
              wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              expect_student{ self.current_locations.length.should == 4 }
              expect_student{ self.observed_locations_in_current_rotation.should == [] }
              expect_student{ self.metadata.current_rotation.should == 1 }
              
              # ROTATION I
              4.times do
                expect_student{ self.observed_all_locations?.should == false }
                on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
                wait('GOING_TO_ASSIGNED_LOCATION')
                ev(:check_in, lambda{{:location => @assigned_location}})
                wait('OBSERVING_PAST')
                ev(:organism_observation, 
                  lambda{{"location" => @assigned_location, "team_name" => "Darwin","assigned_organism" => "fig_tree","observed_organism" => "first","time" => "200 mya"}})
                wait('OBSERVING_PAST')
                ev(:organism_observation, 
                  lambda{{"location" => @assigned_location, "team_name" => "Darwin","assigned_organism" => "fig_tree","observed_organism" => "second","time" => "200 mya"}})
                wait('OBSERVING_PAST')
                
                ev(:organism_observations_done, {})
                
                expect_student{ self.metadata.current_rotation.should == 1 }
                
                wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              end
              
              expect_student{ self.observed_all_locations?.should == true }
              
              # MEETUP I
              on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }              
              wait('GOING_TO_ASSIGNED_LOCATION')
              
              expect_student{ self.metadata.current_task.should == 'meetup'}
              
              meddle do
                stu = chor.lookup_student(config[:nickname])
                stu.stub(:team_is_assembled?).and_return(true)
              end
              
              ev(:check_in, lambda{{:location => @assigned_location}})
              wait('WAITING_FOR_MEETUP_START')
              
              #ev(:meetup_start, {}, {:origin => 'choreographer'})
             
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
              expect_student{ self.current_locations.length.should === 4 }
              expect_student{ self.metadata.current_rotation.should == 2 }
              
              # ROTATION II
              4.times do
                on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
                wait('GOING_TO_ASSIGNED_LOCATION')
                ev(:check_in, lambda{{:location => @assigned_location}})
                wait('OBSERVING_PAST')
                
                ev(:organism_observation, 
                  lambda{{"location" => @assigned_location, "team_name" => "Darwin","assigned_organism" => "fig_tree","observed_organism" => "fig_tree","time" => "200 mya"}})
                wait('OBSERVING_PAST')
                ev(:organism_observation, 
                  lambda{{"location" => @assigned_location, "team_name" => "Darwin","assigned_organism" => "fig_tree","observed_organism" => "monkey","time" => "200 mya"}})
                wait('OBSERVING_PAST')
                ev(:organism_observations_done, {})
                
                expect_student{ self.metadata.current_rotation.should == 2 }
                
                wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              end
              
              # MEETUP II
              on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
              wait('GOING_TO_ASSIGNED_LOCATION')
              expect_student{ self.metadata.current_task.should == 'meetup'}
              ev(:check_in, lambda{{:location => @assigned_location}})
              wait('WAITING_FOR_MEETUP_START')
  
              #ev(:meetup_start, {}, {:origin => 'ateacher'})
              wait("MEETUP")
  
              ev(:note, {
                "author" => "JoeMcStudent",
                "team_name" => "Darwin",
                "meetup" => "2",
                "note" => "Blah blah blah...",
                "specialty" => "primates"
              })
  
              wait("WAITING_FOR_GROUP_TO_FINISH_MEETUP")
              ev(:homework_assignment, {}, {:origin => 'ateacher'})
              
              wait("OUTSIDE")
              
              expect_student do
                # verify that expected metadata has been set 
                self.metadata.current_rotation.should === 2
                self.metadata.current_meetup.should === 2
                self.metadata.state.should === 'OUTSIDE'
                self.metadata.currently_assigned_location.blank?.should === false
                self.metadata.current_location.blank?.should === false
                self.metadata.day.should === 2
              end
              
              finish
            end
          end
        end
      end
    end
    
    @chor.spawn!
    @spec.spawn!
    
    EM.run {
      @chor.run
      @spec.run
    }
  end
  
  it "should go through DAY 2 as per sequence diagram" do
    @spec.chor.class_eval do
      alias_method :orig_lookup_student, :lookup_student
    end
    @spec.chor.stub(:lookup_student) do |username, restoring|
      stu = self.instance_variable_get(:@spec).chor.orig_lookup_student(username)
      if stu
        stu.metadata.day = 2
        stu.metadata.current_rotation = 3
      end
      stu
    end
    
    @spec.config[:nickname] = "bobby"
    
    @spec.class_eval do
      def behaviour
        default_behaviour
        
        someone_joined_room do |stanza|
          if Sail::Agent::Util.extract_login(stanza.from) == "Choreographer"
            sequence do
              ev(:check_in, {:location => "room"})
              wait('ORIENTATION')
              expect_student{ self.in_day_2?.should == true }
              
              
              ev(:feature_observations_start, {}, {:origin => 'ateacher'})
              
              wait('OBSERVING_PAST_FEATURES')
              ev(:organism_features, {
                "team_name"=>"Darwin",
                "author"=>"JoeMcStudent",
                "organism"=>"civet",
                "explanation"=>"bla bla"})
                
              wait('OBSERVING_PAST_FEATURES')
              ev(:organism_features, {
                "team_name"=>"Darwin",
                "author"=>"JoeMcStudent",
                "organism"=>"civet",
                "explanation"=>"bla bla"})
              wait('OBSERVING_PAST_FEATURES')
              ev(:organism_features, {
                "team_name"=>"Darwin",
                "author"=>"JoeMcStudent",
                "organism"=>"civet",
                "explanation"=>"bla bla"})
              wait('OBSERVING_PAST_FEATURES')
              
              ev(:transition_to_present, {}, {:origin => 'ateacher'})
              wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              
              expect_student{ self.metadata.current_rotation.should == 3 }
              
              # ROTATION III
              2.times do
                expect_student{ self.observed_all_locations?.should == false }
                on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
                wait('GOING_TO_ASSIGNED_LOCATION')
                ev(:check_in, lambda{{:location => @assigned_location}})
                wait('OBSERVING_PRESENT')
                
                expect_student{ self.metadata.current_rotation.should == 3 }
                
                ev(:observation_tabulation, lambda{{
                    "team_name" => "test4-test10",
                    "location" => @assigned_location,
                    "organism_presence" => [
                      {"organism" => "proboscis_monkey", "is_present" => "yes"},
                      {"organism" => "muellers_gibbon", "is_present" => "yes"},
                      {"organism" => "white_fronted_langur", "is_present" => "yes"}
                    ]
                  }})
                
                expect_student{ self.metadata.current_rotation.should == 3 }
                
                wait('WAITING_FOR_LOCATION_ASSIGNMENT')
              end
              
              on(:location_assignment){|stanza,data| @assigned_location = data['payload']['location'] }
              wait('GOING_TO_ASSIGNED_LOCATION')
              
              expect_student{ self.metadata.current_task.should == 'brainstorm' }
              expect_student{ Student::LOCATIONS[:brainstorm].include?(self.metadata.currently_assigned_location).should == true }
              
              ev(:check_in, lambda{{:location => @assigned_location}})
              
              wait('BRAINSTORMING')
              
              ev(:concept_discussion, {
                "author" => "studentJoe",
              	"concept" => "Natural selection",
              	"time" => ["200 mya","150 mya","present Borneo" ],
                "organism" => ["fig_tree","ant"],
              	"explanation" => "This is an explanation of some sort"
              })
              wait('BRAINSTORMING')
              
              ev(:concept_discussion, {
                "author" => "studentJoe",
              	"concept" => "Natural selection",
              	"time" => ["200 mya","150 mya","present Borneo" ],
                "organism" => ["fig_tree","ant"],
              	"explanation" => "This is an explanation of some sort"
              })
              wait('BRAINSTORMING')
              
              ev(:homework_assignment, {}, {:origin => 'ateacher'})
              
              wait('DONE')
              
              finish
            end
          end
        end
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