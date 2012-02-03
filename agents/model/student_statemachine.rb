# $: << '../../EvoRoom3/agents/sail.rb/lib'; $: << '../../EvoRoom3/agents'; require 'model/student'; Student.site = "http://rollcall.proto.encorelab.org"; s = Student.find(:first); load 'golem/visualizer.rb'; v = Golem::Visualizer.new; v.visualize(s.statemachine); puts "--[ callbacks in use ]--"; s.statemachine.inspect.scan(/@callback=\:([\w_\?\!]+)/i).flatten.uniq.each{|m| puts (s.respond_to?(m) ? "√" : "x") + " #{m}"}; puts "--[ events ]--"; puts s.statemachine.events.values.collect{|ev| ev.name}; nil
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
    student.agent.event!(:state_change, {:from => transition.from.name, :to => transition.to.name, :event => event.name}, :origin => student.username)
  end

  # DAY 1

  state :LOGGED_IN do
    on :check_in do
      transition :to => :IN_ROOM do
        guard(:failure_message => "the student must check in at the room entrance first") {|student, loc| loc == "room"}
      end
    end
  end

  state :IN_ROOM do
    on :rotation_start, :to => :IN_ROTATION,
      :action => :increment_rotation!
  end

  state :IN_ROTATION do
    enter :assign_rotation_location!
    on :location_assignment, :to => :GOING_TO_ASSIGNED_LOCATION do
      action do |student, loc|
        student.metadata.currently_assigned_location = loc
        student.metadata.going_to = 'observe_in_rotation'
      end
    end
  end

  state :OBSERVING_IN_ROTATION do
    on :organism_observation do
      transition :to => :ROTATION_COMPLETED, :if => :rotation_completed?, :action => :store_observation
      transition :to => :IN_ROTATION, :action => :store_observation
    end
  end
  
  state :ROTATION_COMPLETED do
    enter do |student|
      student.join_meetup!
    end
    on :location_assignment, :to => :GOING_TO_ASSIGNED_LOCATION do
      action do |student, loc|
        student.metadata.currently_assigned_location = loc
        student.metadata.going_to = 'meetup'
      end
    end
  end
  
  state :GOING_TO_ASSIGNED_LOCATION do
    on :check_in do
      guard :at_assigned_location?, :failure_message => "the student is at the wrong location"
      transition :to => :WAITING_FOR_MEETUP_TOPIC, :if => proc{|student| student.going_to?('meetup')}
      transition :to => :OBSERVING_IN_ROTATION, :if => proc{|student| student.going_to?('observe_in_rotation')}
      transition :to => :OBSERVING_PRESENT, :if => proc{|student| student.going_to?('observe_present')}
    end
    # on :check_in do
    #   transition :action => proc{|student| student.agent.event!(:at_wrong_location) }
    # end
  end
  
  state :WAITING_FOR_MEETUP_TOPIC do
    enter do |student|
      student.agent.event!(:at_meetup_location)
    end
    on :topic_assignment, :to => :MEETUP_TOPIC_ASSIGNED, 
      :action => :store_meetup_topic
  end
  
  state :MEETUP_TOPIC_ASSIGNED do
    on :note, :action => :store_note
    on :meetup_end, :to => :IN_ROTATION, :action => :increment_rotation!
    on :homework_assignment, :to => :COMPLETED_DAY_1
  end

  # DAY 2

  state :COMPLETED_DAY_1 do
    on :check_in do
      transition :to => :PAST do
        guard(:failure_message => "the student must check in at the room entrance first") {|student, loc| loc == "room"}
      end
    end
  end
  
  state :PAST do
    on :note, :action => :store_note
    on :transition, :to => :PRESENT
  end
  
  state :PRESENT do
    enter :assign_present_location!
    on :location_assignment, :to => :GOING_TO_ASSIGNED_LOCATION do
      action do |student, loc|
        student.metadata.currently_assigned_location = loc
        student.metadata.going_to = 'observe_present'
      end
    end
  end
  
  state :OBSERVING_PRESENT do
    on :observation_tabulation do
      transition :to => :BRAINSTORMING do
        guard :present_observations_completed?
        action :store_note
      end
      transition :to => :PRESENT do
        action :store_note
      end
    end
  end
  
  state :BRAINSTORMING do
    on :concept_discussion, :action => :store_note
    on :homework_assignment, :to => :COMPLETED_DAY_2
  end
end