# $: << '../../EvoRoom3/agents/sail.rb/lib'; $: << '../../EvoRoom3/agents'; require 'model/student'; Student.site = "http://rollcall.proto.encorelab.org"; s = Student.find(:first); load 'golem/visualizer.rb'; v = Golem::Visualizer.new; v.visualize(s.statemachine)
StudentStatemachine = proc do
  initial_state :LOGGED_IN

  state_attribute_writer (proc do |student, new_state|
    student.metadata.state = new_state
  end)

  state_attribute_reader (proc do |student|
    student.metadata.state? && student.metadata.state
  end)

  on_all_transitions do |student, event, transition, *args|
    student.agent.log "#{student.username.inspect} transitioning from #{transition.from.name} to #{transition.to.name}..."
  end

  state :LOGGED_IN do
    # we're assuming that they're checking in for the "room"
    on :check_in do
      transition :to => :IN_ROOM do
        guard(:failure_message => "the student must check in at the room entrance first") {|student, loc| loc == "room"}
      end
    end
  end

  state :IN_ROOM do
    on :rotation_started, :to => :IN_ROTATION,
      :action => :increment_rotation
  end

  state :IN_ROTATION do
    on :location_assignment, :to => :GOING_TO_OBSERVATION_LOCATION, 
      :action => :store_currently_assigned_location
  end

  state :GOING_TO_OBSERVATION_LOCATION do
    on :check_in, :to => :AT_ASSIGNED_OBSERVATION_LOCATION do
      guard(:failure_message => "the student is at the wrong location") do |student, loc| 
        student.metadata.currently_assigned_location == loc
      end
    end
  end

  state :AT_ASSIGNED_OBSERVATION_LOCATION do
    on :organism_observed do
      transition :to => :ROTATION_COMPLETED, :if => :rotation_completed?, :action => :store_organism_observation
      transition :to => :IN_ROTATION, :action => :store_organism_observation
    end
  end
  
  state :ROTATION_COMPLETED do
    enter :start_or_join_meetup
    on :meetup_started, :to => :GOING_TO_MEETUP_LOCATION, 
      :action => :store_currently_assigned_location
  end
  
  state :GOING_TO_MEETUP_LOCATION do
    on :check_in, :to => :WAITING_FOR_MEETUP_TOPIC do
      guard(:failure_message => "the student is at the wrong location") do |student, loc| 
        student.metadata.currently_assigned_location == loc
      end
    end
  end
  
  state :WAITING_FOR_MEETUP_TOPIC do
    on :topic_assignment, :to => :MEETUP_TOPIC_ASSIGNED, 
      :action => :store_meetup_topic
  end
  
  state :MEETUP_TOPIC_ASSIGNED do
    on :note_submitted, :to => :MEETUP_TOPIC_ASSIGNED,
      :action => :store_meetup_note
    on :meetup_completed, :to => :IN_ROTATION, 
      :action => :increment_rotation
    on :homework_assigned, :to => :DONE
  end


end