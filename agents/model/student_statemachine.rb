# $: << '../../EvoRoom3/agents/sail.rb/lib'; $: << '../../EvoRoom3/agents'; require 'model/student'; Student.site = "http://rollcall.proto.encorelab.org"; s = Student.find('mzukowski'); load 'golem/visualizer.rb'; v = Golem::Visualizer.new(s.statemachine); v.visualize(:png, '../../EvoRoom3/agents/model/student_statemachine.png'); puts "--[ callbacks in use ]--"; s.statemachine.inspect.scan(/@callback=\:([\w_\?\!]+)/i).flatten.uniq.each{|m| puts (s.respond_to?(m) ? "√" : "x") + " #{m}"}; puts "--[ events ]--"; puts s.statemachine.events.values.collect{|ev| ev.name}; nil

StudentStatemachine = proc do
  initial_state :OUTSIDE

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

  state :OUTSIDE do
    on :check_in do
      transition :to => :ORIENTATION do
        guard(:failure_message => "the student must check in at the room entrance first") {|student, loc| loc == "room"}
      end
    end
  end

  state :ORIENTATION do
    on :observations_start do
      comment "Triggered by the teacher on day 1"
      transition :to => :WAITING_FOR_LOCATION_ASSIGNMENT, :if => :in_day_1? do
        action do |student|
          student.metadata.current_task = "observe_past_presence"
          student.increment_rotation!
          student.assign_next_observation_location!
        end
      end
    end
    
    on :feature_observations_start do
      comment "Triggered by the teacher on day 2"
      transition :to => :OBSERVING_PAST_FEATURES, :if => :in_day_2? do
        action do |student|
          student.metadata.current_task = "observe_past_features"
        end
      end
    end
  end

  state :WAITING_FOR_LOCATION_ASSIGNMENT do
    on :location_assignment, :to => :GOING_TO_ASSIGNED_LOCATION do
      action do |student, loc|
        student.metadata.currently_assigned_location = loc
      end
    end
  end

  state :OBSERVING_PAST do
    exit do |student|
      if student.observed_all_locations?
        student.metadata.current_task = 'meetup'
        student.assign_meetup_location!
      else
        student.assign_next_observation_location!
      end
    end
    
    on :organism_observation, :to => :WAITING_FOR_LOCATION_ASSIGNMENT, :action => :store_observation
  end
  
  state :GOING_TO_ASSIGNED_LOCATION do
    on :check_in do
      guard :at_assigned_location?, :failure_message => "the student is at the wrong location"
      transition :to => :WAITING_FOR_MEETUP_TOPIC, :if => proc{|student| student.metadata.current_task == 'meetup'}
      transition :to => :OBSERVING_PAST, :if => proc{|student| student.metadata.current_task == 'observe_past_presence'}
      transition :to => :OBSERVING_PRESENT, :if => proc{|student| student.metadata.current_task == 'observe_present_presence'}
      transition :to => :BRAINSTORMING, :if => proc{|student| student.metadata.current_task == 'brainstorm'}
    end
    # on :check_in do
    #   transition :action => proc{|student| student.agent.event!(:at_wrong_location) }
    # end
  end
  
  state :WAITING_FOR_MEETUP_TOPIC do
    on :topic_assignment, :to => :MEETUP, 
      :action => :store_meetup_topic
  end
  
  state :MEETUP do
    on :note, :to => :WAITING_FOR_GROUP_TO_FINISH_MEETUP, :action => :store_note
    on :homework_assignment do
      transition :to => :OUTSIDE do
        comment "Allows the teacher to end the meetup\neven if not all students have submitted notes."
        action do |student|
          student.metadata.day_1_completed = true
        end
      end
    end
  end
  
  state :WAITING_FOR_GROUP_TO_FINISH_MEETUP do
    comment "Triggers 'meetup_end' event if the student is the last one in their group to submit a meetup note."
    enter do |student|
      student.meetup_finished! if student.all_group_members_have_submitted_meetup_notes?
    end
    on :start_observations, :to => :WAITING_FOR_LOCATION_ASSIGNMENT do
      comment "Triggered by the teacher after the first meetup."
      action do |student|
        student.metadata.current_task = "observe_past_presence"        
        student.increment_rotation!
        student.assign_next_observation_location!
      end
    end
    on :homework_assignment, :to => :OUTSIDE do
      action do |student|
        student.metadata.day_1_completed = true
      end
    end
  end
  
  state :OBSERVING_PAST_FEATURES do
    on :organism_features, :action => :store_observation
    on :transition_to_present, :to => :WAITING_FOR_LOCATION_ASSIGNMENT do
      comment "Note the name change. Also, Michelle will have her\nown event in addition to this to re-trigger animation."
      action do |student|
        student.metadata.current_task = 'observe_present_presence'
        student.assign_next_observation_location!
      end
    end
  end
  
  state :OBSERVING_PRESENT do
    exit do |student|
      if student.observed_all_locations?
        student.metadata.current_task = 'brainstorm'
        student.assign_brainstorm_location!
      else
        student.assign_next_observation_location!
      end
    end
    
    on :observation_tabulation, :to => :WAITING_FOR_LOCATION_ASSIGNMENT, :action => :store_tabulation
  end
  
  state :BRAINSTORMING do
    on :concept_discussion, :action => :store_note
    on :homework_assignment, :to => :DONE
  end
end