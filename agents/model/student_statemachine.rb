# $: << '../../EvoRoom3/agents/sail.rb/lib'; $: << '../../EvoRoom3/agents'; require 'model/student'; Student.site = "http://rollcall.proto.encorelab.org"; s = Student.find('mzukowski'); load 'golem/visualizer.rb'; v = Golem::Visualizer.new(s.statemachine); v.visualize(:png, '../../EvoRoom3/agents/model/student_statemachine.png'); puts "--[ callbacks in use ]--"; s.statemachine.inspect.scan(/@callback=\:([\w_\?\!]+)/i).flatten.uniq.each{|m| puts (s.respond_to?(m) ? "√" : "x") + " #{m}"}; puts "--[ events ]--"; puts s.statemachine.events.values.collect{|ev| ev.name}; nil

StudentStatemachine = proc do
  initial_state :OUTSIDE

  state_attribute_writer (proc do |student, new_state|
    student.metadata.state = new_state.to_s
  end)

  state_attribute_reader (proc do |student|
    student.metadata.state? && student.metadata.state.to_sym
  end)

  on_all_transitions do |student, event, transition, *args|
    student.agent.log "#{student.username.inspect} transitioning from #{transition.from.name} to #{transition.to.name}..."
    student.agent.event!(:state_change, {:from => transition.from.name, :to => transition.to.name, :event => event.name}, :origin => student.username)
  end

  state :OUTSIDE do
    enter do |student|
      student.metadata.day = 1 if not student.metadata.day?
    end
    on :check_in do
      action lambda{|student,check_in| student.metadata.current_location = check_in[:location]}
      transition :to => :ORIENTATION do
        guard(:failure_message => "the student must check in at the room entrance first") do |student,check_in|
          check_in[:location] == "room"
        end
      end
    end
  end

  state :ORIENTATION do
    on :observations_start do
      transition :to => :WAITING_FOR_LOCATION_ASSIGNMENT, :if => :in_day_1? do
        comment "Triggered by the teacher on day 1."
        action do |student|
          student.metadata.current_task = "observe_past_presence"
          student.increment_rotation!
        end
      end
    end
    
    on :feature_observations_start do
      transition :to => :OBSERVING_PAST_FEATURES, :if => :in_day_2? do
        comment "Triggered by the teacher on day 2"
        action do |student|
          student.metadata.current_task = "observe_past_features"
        end
      end
    end
  end

  state :WAITING_FOR_LOCATION_ASSIGNMENT do
    enter { |student|
      if student.observed_all_locations?
        if student.metadata.current_task == "observe_past_presence"
          student.metadata.current_task = 'meetup'
          student.assign_meetup_location!
        elsif student.metadata.current_task == "observe_present_presence"
          student.metadata.current_task = 'brainstorm'
          student.assign_brainstorm_location!
        else
          raise "#{student}'s current_task is invalid! (#{student.metadata.current_task})"
        end
      else
        student.assign_next_observation_location!
      end
    }
    
    on :location_assignment, :to => :GOING_TO_ASSIGNED_LOCATION do
      guard do |student,location_assignment|
        location_assignment[:username] == student.username
      end
      action do |student,location_assignment|
        student.metadata.currently_assigned_location = location_assignment[:location]
      end
    end
  end

  state :OBSERVING_PAST do
    on :organism_observation, :action => :store_observation
    on :organism_observations_done, :to => :WAITING_FOR_LOCATION_ASSIGNMENT
  end
  
  state :GOING_TO_ASSIGNED_LOCATION do
    on :check_in do
      guard :failure_message => "the student is at the wrong location" do |student,check_in|
        student.agent.log "#{student}'s current task is #{student.metadata.current_task.inspect}"
        loc = check_in[:location]
        student.metadata.currently_assigned_location == loc
      end
      transition :to => :WAITING_FOR_MEETUP_START do
        guard :failure_message => "student's current task is not 'meetup'" do |student|
          student.metadata.current_task == 'observe_past_presence' && student.observed_all_locations?
        end
      end
      transition :to => :OBSERVING_PAST do
        guard :failure_message => "student's current task is not 'observe_past_presence'" do |student|
          student.metadata.current_task == 'observe_past_presence'
        end
      end
      transition :to => :OBSERVING_PRESENT do
        guard :failure_message => "student's current task is not 'observe_present_presence'" do |student|
          student.metadata.current_task == 'observe_present_presence'
        end
      end
      transition :to => :BRAINSTORMING do
        guard :failure_message => "student's current task is not 'brainstorm'" do |student|
         student.metadata.current_task == 'brainstorm' && student.observed_all_locations?
        end
      end
    end
    # on :check_in do
    #   transition :action => proc{|student| student.agent.event!(:at_wrong_location) }
    # end
  end
  
  state :WAITING_FOR_MEETUP_START do
    enter do |student|
      student.increment_meetup!
      student.announce_meetup_start! if student.team_is_assembled?
    end
    on :meetup_start, :to => :MEETUP do
      guard do |student,meetup_start|
        meetup_start[:team_name] == student.team_name
      end
    end
  end
  
  state :MEETUP do
    on :note, :to => :WAITING_FOR_GROUP_TO_FINISH_MEETUP, :action => :store_note
    on :observations_start, :to => :WAITING_FOR_LOCATION_ASSIGNMENT do
      transition :to => :WAITING_FOR_LOCATION_ASSIGNMENT do
        comment "Allows teacher to move on even if not all students are done."
        action do |student|
          student.metadata.current_task = "observe_past_presence"        
          student.increment_rotation!
        end
      end
    end
    on :homework_assignment do
      transition :to => :OUTSIDE do
        comment "Allows the teacher to end the meetup\neven if not all students have submitted notes."
        action do |student|
          student.metadata.day = 2
        end
      end
    end
  end
  
  state :WAITING_FOR_GROUP_TO_FINISH_MEETUP do
    on :observations_start, :to => :WAITING_FOR_LOCATION_ASSIGNMENT do
      transition :to => :WAITING_FOR_LOCATION_ASSIGNMENT do
        comment "Triggered by the teacher after the first meetup."
        action do |student|
          student.metadata.current_task = "observe_past_presence"        
          student.increment_rotation!
        end
      end
    end
    on :homework_assignment, :to => :OUTSIDE do
      action do |student|
        student.metadata.day = 2
      end
    end
  end
  
  state :OBSERVING_PAST_FEATURES do
    on :organism_features, :action => :store_observation
    on :transition_to_present do
      transition :to => :WAITING_FOR_LOCATION_ASSIGNMENT do
        comment "Note the name change. Also, Michelle will have her\nown event in addition to this to re-trigger animation."
        action do |student|
          student.metadata.current_rotation = 3
          student.metadata.current_task = 'observe_present_presence'
        end
      end
    end
  end
  
  state :OBSERVING_PRESENT do
    on :observation_tabulation, :to => :WAITING_FOR_LOCATION_ASSIGNMENT, :action => :store_observation
  end
  
  state :BRAINSTORMING do
    on :concept_discussion, :action => :store_note
    on :homework_assignment, :to => :DONE
  end
end