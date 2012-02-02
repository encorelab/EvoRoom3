require 'sail/rollcall/user'
require 'sail/rollcall/group'

require 'golem'
require File.dirname(__FILE__)+'/student_statemachine'

class Student < Rollcall::User
  self.element_name = "user"
  
  LOCATIONS = [
      'station_a',
      'station_b',
      'station_c',
      'station_d'
    ]
  
  include Golem
  
  cattr_accessor :agent
  
  def to_s
    "Student:#{username.inspect}[#{state}]"
  end
  
  def username
    account.login
  end
  
  def group_code
    raise "#{self} does not have any groups!" if !groups || groups.empty?
    groups.first.name
  end
  
  def evoroom_group
    Rollcall::Group.site = Student.site if Rollcall::Group.site.blank?
    Rollcall::Group.find(group_code)
  end
  
  delegate :mongo, :to => :agent
  delegate :log,   :to => :agent
  
  def increment_rotation
    if student.metadata.current_rotation
      student.metadata.current_rotation = student.metadata.current_rotation.to_i + 1
    else
      student.metadata.current_rotation = 1
    end
  end
  
  def store_meetup_topic(topic)
    raise NotImplementedError
  end
  
  def at_assigned_location?(loc)
    student.metadata.currently_assigned_location == loc
  end
  
  def going_to?(what)
    student.metadata.going_to == what
  end
  
  def store_observation(observation)
    log "Storing  observation: #{observation.inspect}"
    mongo.collection(:observations).save(observation)
    agent.event!(:stored_observation, observation)
  end
  
  def store_note(note)
    log "Storing  observation: #{note.inspect}"
    mongo.collection(:notes).save(note)
    agent.event!(:stored_note, note)
  end
  
  def assign_rotation_location!
    raise NotImplementedError
  end
  
  def assign_present_location!
    raise NotImplementedError
  end
  
  def present_observations_completed?
    raise NotImplementedError
  end
  
  def rotation_completed?
    #mongo.collection(:organism_observations).find({})
    raise NotImplementedError
  end
  
  def join_meetup!
    raise NotImplementedError
  end
  
  
  
  define_statemachine(&StudentStatemachine)
end