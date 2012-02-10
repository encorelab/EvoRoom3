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
      
      @student.current_locations.each do |loc|
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
  
  describe '#store_meetup_topic' do
    it "stores the given meetup topic in the expected format" do
      
      data = {
        "topic" => "What do you...",
        "tags" => ["fig_tree", "monkey"],
        "username" => "astudent"
      }
      
      @student.store_meetup_topic(data)
      meetup = @student.mongo[:meetups].find_one("topic" => data["topic"])
      
      meetup['tags'].should == data["tags"]
    end
  end
end