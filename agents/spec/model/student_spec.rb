# FOR FAST mongod:
# mongod --noprealloc --smallfiles --nssize 1

$: << File.dirname(__FILE__)+'/../..'
$: << File.dirname(__FILE__)+'/../../sail.rb/lib'

require 'mongo'
require 'model/student'

require 'spec/support/stubbed_externals'


describe Student do
  include_context :stubbed_externals
  
  {:day_1 => proc{|student| student.metadata.day_1_completed = false},
   :day_2 => proc{|student| student.metadata.day_1_completed = true}}.
  each do |day, proc|
    context day do
      before(:each) do
        proc.call(@student)
      end
    
      describe "#assign_next_observation_location!" do
        it "assigns student to a valid location" do
          @student.agent.should_receive_event(:location_assignment, 
            {:location => an_instance_of(String), :username => @student.username})
          
          @student.metadata.current_rotation = 1
          
          @student.agent.stub(:event!).with(:location_assignment, an_instance_of(Hash)) do |event_type, data|
            @student.current_locations.should include(data[:location])
            
            obs = {
              "team_name" => "Team Darwin",
              "assigned_organism" => "fig_tree",
              "observed_organism" => "fig_tree",
              "location" => loc,
              "time" => "200 mya"
            }
            @student.agent.should_receive_event(:stored_observation, an_instance_of(Hash))
            @student.store_observation(obs)
          end
          
          @student.assign_next_observation_location!
        end
        
        it "does not repeat locations" do          
          @student.metadata.current_rotation = 1
          
          @student.agent.stub(:event!).with(:location_assignment, an_instance_of(Hash)) do |event_type, data|
            obs = {
              "team_name" => "Team Darwin",
              "assigned_organism" => "fig_tree",
              "observed_organism" => "fig_tree",
              "location" => data[:location],
              "time" => "200 mya"
            }
            @student.agent.stub(:event!).with(:stored_observation, an_instance_of(Hash))
            @student.store_observation(obs)
          end
          
          @student.current_locations.each do
            @student.assign_next_observation_location!
          end
        end
      end
    end
  end
  
  describe '#observed_locations_in_current_rotation' do
    it "returns only the locations from observations stored for the current rotation" do
      @student.agent.stub(:event!).with(:stored_observation, an_instance_of(Hash))
      
      @student.metadata.current_rotation = 1
      
      @student.observed_locations_in_current_rotation.should be_empty
      
      obs = {
        "location" => 'one',
        "team_name" => "Team Darwin",
        "assigned_organism" => "fig_tree",
        "observed_organism" => "fig_tree",
        "time" => "200 mya"
      }
      
      @student.store_observation(obs)
      
      @student.observed_locations_in_current_rotation.should == ['one']
      
      obs['location'] = 'two'
      @student.store_observation(obs)
      
      @student.observed_locations_in_current_rotation.should == ['one', 'two']
      
      @student.metadata.current_rotation = 2
      
      @student.observed_locations_in_current_rotation.should be_empty
      
      obs['location'] = 'one'
      @student.store_observation(obs)
      
      @student.observed_locations_in_current_rotation.should == ['one']
    end
  end
  
  describe '#observed_all_locations?' do
    it "returns FALSE when all locations is the current rotation have NOT been observed" do
      @student.metadata.current_rotation = 1
      
      obs = {
        "team_name" => "Team Darwin",
        "assigned_organism" => "fig_tree",
        "observed_organism" => "fig_tree",
        "location" => @student.current_locations.first,
        "time" => "200 mya"
      }
      @student.agent.stub(:event!).with(:stored_observation, an_instance_of(Hash))
      @student.store_observation(obs)
      
      @student.observed_all_locations?.should be_false
    end
    it "returns TRUE when all locations is the current rotation have been observed" do
      @student.metadata.current_rotation = 1
      
      @student.agent.stub(:event!).with(:stored_observation, an_instance_of(Hash))
      
      @student.current_locations.reverse.each do |loc|
        obs = {
          "team_name" => "Team Darwin",
          "assigned_organism" => "fig_tree",
          "observed_organism" => "fig_tree",
          "location" => loc,
          "time" => "200 mya"
        }
        @student.store_observation(obs)
      end
      
      @student.observed_all_locations?.should be_true
      
      @student.increment_rotation!
      
      @student.observed_all_locations?.should be_false
    end
  end
  
  describe '#team_members' do
    it "should include only students who are on the student's team" do
      members = @student.team_members
    
      members.should_not be_empty
      
      members.each do |m|
        m.respond_to?(:account).should be_true 
        m.groups.first.name.should == @student.team_name
      end
    end
  end
  
  describe '#team_is_assebled?' do
    it "should return true when all team members are at the same location and in the same state" do
      orig_team_members = @student.team_members
      @student.stub(:team_members) do
        orig_team_members.collect do |m|
          orig_metadata = m.metadata
          orig_metadata.stub(:current_location){'foo'}
          orig_metadata.stub(:state){:MEETUP}
          m.stub(:metadata) {orig_metadata}
          m
        end
      end
      
      @student.metadata.current_location = 'foo'
      @student.metadata.state = :MEETUP
      
      @student.team_is_assembled?.should be_true
      
      @student.metadata.current_location = 'somewhere_else'
      @student.metadata.state = :MEETUP
      
      @student.team_is_assembled?.should be_false
    end
  end
end