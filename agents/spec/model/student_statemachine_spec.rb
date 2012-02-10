$: << File.dirname(__FILE__)+'/../..'
$: << File.dirname(__FILE__)+'/../../sail.rb/lib'

require 'mongo'
require 'model/student'

require 'spec/support/stubbed_externals'


describe Student do
  describe "#statemachine" do
    include_context :stubbed_externals

    it "should trigger 'state_change' events on transition" do
      @student.agent.stub(:event!)
      @student.state = :OUTSIDE
      @student.agent.should_receive_event(:state_change, 
        {:event=>:check_in, :to=>:ORIENTATION, :from=>:OUTSIDE}, 
        {:origin=>"mzukowski"})
      @student.check_in!(:location => "room")
      @student.agent.should_receive_event(:state_change, 
        {:event=>:observations_start, :to=>:WAITING_FOR_LOCATION_ASSIGNMENT, :from=>:ORIENTATION}, 
        {:origin=>"mzukowski"})
      @student.observations_start!
    end
    
    it "should set the current location on check_in" do
      @student.agent.stub(:event!).
        with(:state_change, an_instance_of(Hash), an_instance_of(Hash))
      
      @student.state = :OUTSIDE
      @student.check_in!(:location => "room")
      
      @student.metadata.current_location.should == "room"
    end
    
    it "should walk through to the end of the first day using events in sequence diagram" do
      @student.agent.stub(:event!).
        with(:state_change, an_instance_of(Hash), an_instance_of(Hash))
     @student.agent.stub(:event!).
        with(:stored_observation, an_instance_of(Hash))
        
        
      @student.state = :OUTSIDE
      
      @student.check_in!(:location => "room")
      @student.state.should == :ORIENTATION
      
      @student.agent.should_receive_event(:location_assignment,
        {:location=>an_instance_of(String), :username=>@student.username})
      @student.observations_start!

      # ROTATION I
      
      expect { @student.metadata.currently_assigned_location }.to_not raise_error(NoMethodError)
      
      Student::LOCATIONS[:day_1].length.should == 4
      @student.current_locations.should == Student::LOCATIONS[:day_1]
      
      @student.current_locations.each do |loc|
        @student.metadata.current_task.should == 'observe_past_presence'
        
        @student.state.should == :GOING_TO_ASSIGNED_LOCATION
        
        @student.check_in!(:location => @student.metadata.currently_assigned_location)
        @student.metadata.current_location.should == @student.metadata.currently_assigned_location
        @student.state.should == :OBSERVING_PAST
      
        @student.agent.should_receive_event(:location_assignment,
            {:location=>an_instance_of(String), :username=>@student.username})
        
        @student.organism_observation!({
          "team_name" => "Team Darwin",
          "assigned_organism" => "fig_tree",
          "observed_organism" => "fig_tree",
          "location" => @student.metadata.current_location,
          "time" => "200 mya"
        })
      end
      
      @student.metadata.current_task.should == 'meetup'
    end
  end
end