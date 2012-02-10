require 'sail/rollcall/user'
require 'sail/rollcall/group'
require 'active_support/all'

require 'golem'
require File.dirname(__FILE__)+'/student_statemachine'

class Student < Rollcall::User
  self.element_name = "user"
  
  LOCATIONS = {
    :day_1 => [
      'station_a',
      'station_b',
      'station_c',
      'station_d'
    ],
    :day_2 => [
      'borneo',
      'sumatra'
    ]
  }
  
  include Golem
  
  cattr_accessor :agent
  
  def to_s
    "Student:#{username.inspect}[#{state}]"
  end
  
  def current_locations
    Student::LOCATIONS[in_day_2? ? :day_2 : :day_1]
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
  delegate :log, :to => :agent
  
  def observed_all_locations?
    current_locations.all? do |loc|
      mongo.collection(:observations).find(
        :location => loc, 
        :rotation => self.metadata.current_rotation,
        :username => self.username
      ).count > 0
    end
  end
  
  def in_day_1?
    return !self.metadata.day_1_completed? || self.metadata.day_1_completed == false
  end
  
  def in_day_2?
    return self.metadata.day_1_completed? && self.metadata.day_1_completed == true
  end
  
  def at_assigned_location?(loc)
    self.metadata.currently_assigned_location == loc
  end
  
  def going_to?(what)
    self.metadata.going_to == what
  end
  
  def store_meetup_topic(data)
    data[:timestamp] ||= Time.now
    mongo[:meetups].save(data)
  end
  
  def store_observation(observation)
    observation.symbolize_keys!
    log "Storing  observation: #{observation.inspect}"
    observation[:rotation] = self.metadata.current_rotation
    observation[:location] ||= self.metadata.current_location
    observation[:username] = self.username
    observation[:timestamp] = Time.now
    mongo.collection(:observations).save(observation)
    agent.event!(:stored_observation, observation)
  end
  
  def store_note(note)
    log "Storing  observation: #{note.inspect}"
    mongo.collection(:notes).save(note)
    agent.event!(:stored_note, note)
  end
  
  def increment_rotation!
    if self.metadata.respond_to?(:current_rotation) && self.metadata.current_rotation
      self.metadata.current_rotation = self.metadata.current_rotation.to_i + 1
    else
      self.metadata.current_rotation = 1
    end
  end
  
  def assign_next_observation_location!    
    observed = mongo.collection(:observations).
      find(:username => self.username, :rotation => self.metadata.current_rotation).to_a.
      collect{|obs| obs['location']}
    
    locs_left = current_locations - observed
    selected_loc = locs_left[rand(locs_left.length)]
    
    self.agent.event!(:location_assignment,
      :location => selected_loc,
      :username => self.username
    )
  end
  
  def assign_meeting_location!
    # TODO: everyone in the group has to go to the same location
    student.metadata.going_to = 'meetup'
    agent.event!(:location_assignment,
      :location => current_locations[rand(current_locations.length)],
      :username => self.username
    )
  end
  
  
  define_statemachine(&StudentStatemachine)
end