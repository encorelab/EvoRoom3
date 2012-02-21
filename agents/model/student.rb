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
    :day_2 => {
      'borneo' => ['station_a', 'station_b'],
      'sumatra' => ['station_c', 'station_d']
    },
    :brainstorm => ["station_c", "station_b"]
  }
  
  include Golem
  
  cattr_accessor :agent
  
  def to_s
    "Student:#{username.inspect}[#{state}]"
  end
  
  def current_locations
    if self.metadata.current_task == 'observe_present_presence' || self.metadata.current_task == 'brainstorm'
      Student::LOCATIONS[:day_2].keys
    else
      Student::LOCATIONS[:day_1]
    end
  end
  
  def username
    account.login
  end
  
  def group_code
    raise "#{self} does not have any groups!" if !groups || groups.empty?
    groups.first.name
  end
  
  def assigned_organisms
    JSON.parse(student.metadata.assigned_organisms)
  end
  
  def evoroom_group
    Rollcall::Group.site = Student.site if Rollcall::Group.site.blank?
    Rollcall::Group.find(group_code)
  end
  
  delegate :mongo, :to => :agent
  delegate :log, :to => :agent
  
  def observed_locations_in_current_rotation
    observed = mongo.collection(:observations).find(
      :rotation => self.metadata.current_rotation,
      :username => self.username
    ).to_a.collect{|obs| obs['location']}
    
    if self.metadata.current_task == 'observe_present_presence' || 
        self.metadata.current_task == 'brainstorm' || 
        self.metadata.state == 'OBSERVING_PRESENT'
      if observed.include?('station_a') || observed.include?('station_b')
        observed << 'borneo'
        observed.delete_if{|loc| loc == 'station_a' || loc == 'station_b'}
      end
      if observed.include?('station_c') || observed.include?('station_d') 
        observed << 'sumatra'
        observed.delete_if{|loc| loc == 'station_c' || loc == 'station_d'}
      end
      
      # if observed.include?('borneo')
      #   observed << 'station_a'
      #   observed << 'station_b'
      #   observed.delete_if{|loc| loc == 'station_a' || loc == 'station_b'}
      # end
      # if observed.include?('sumatra') 
      #   observed << 'station_c'
      #   observed << 'station_d'
      #   observed.delete_if{|loc| loc == 'station_c' || loc == 'station_d'}
      # end
      
      # if observed.include?('borneo')
      #   observed += Student::LOCATIONS[:day_2]['borneo']
      # end
      # if observed.include?('sumatra')
      #   observed += Student::LOCATIONS[:day_2]['sumatra']
      # end
    end
    
    observed
  end
  
  def observed_all_locations?
    obsed = (current_locations - observed_locations_in_current_rotation)
    log "#{self} must still do the following locations: #{obsed.inspect}"
    obsed.empty?
  end
  
  def in_day_1?
    return !self.metadata.day? || self.metadata.day.to_i == 1
  end
  
  def in_day_2?
    return self.metadata.day? && self.metadata.day.to_i == 2
  end
  
  def at_assigned_location?(loc)
    self.metadata.currently_assigned_location == loc
  end
  
  def going_to?(what)
    self.metadata.going_to == what
  end
  
  def team_members
    g = Rollcall::Group.find(self.team_name)
    my_members = g.members.collect do |m|
      # when running under ActiveResource::HttpMock, `element_name` seems to be ignored, so we need to check both possibilities
      u_id = (m.id? && m.id || m.user? && m.user.id)
      if u_id == self.id
        nil
      else
        Rollcall::User.find(u_id)
      end
    end
    my_members -= [nil]
    log "Got team members for #{self} (#{self.team_name}): #{my_members.collect{|m| m.account.login}.inspect}"
    my_members
  end
  
  def team_is_assembled?
    log "Checking if #{self}'s members are assembled..."
    mems = self.team_members
    all_membernames = mems.collect{|m| m.account.login}
    all_membercrap = []
    ass_membernames = self.team_members.select do |m|
      begin
        # FIXME: so ugly it burns the eyes
        all_membercrap << {:username => m.account.login, :location => m.metadata.current_location, :state => m.metadata.state}
        m.metadata.current_location == self.metadata.current_location &&
          m.metadata.state == self.metadata.state
      rescue NoMethodError
        false
      end
    end.collect{|m| m.account.login}
    
    log "#{self}.team_is_assembled?: "+all_membercrap.collect{|crap| crap[:username].inspect + "["+crap[:state].to_s+"] is at " + crap[:location]}.join("; ")
    
    if (all_membernames - ass_membernames).empty?
      log "All of team #{self.team_name} is assembled!"
      return true
    else
      log "Still waiting for #{(all_membernames - ass_membernames).inspect} to assemble :("
      return false
    end
  end
  
  def current_meetup
    if metadata.current_meetup?
      metadata.current_meetup
    else
      1
    end
  end
  
  def store_observation(observation)
    observation.symbolize_keys!
    log "Storing  observation: #{observation.inspect}"
    
    observation[:rotation] = self.metadata.current_rotation if self.metadata.current_rotation?
    observation[:location] ||= self.metadata.current_location if self.metadata.current_location?
    observation[:username] = self.username
    observation[:timestamp] = Time.now
    mongo.collection(:observations).save(observation)
    
    observation[:_id] = observation[:_id].to_s
    agent.event!(:stored_observation, observation)
  end
  
  def store_note(note)
    log "Storing  observation: #{note.inspect}"
    mongo.collection(:notes).save(note)
    note[:_id] = note[:_id].to_s
    agent.event!(:stored_note, note)
  end
  
  def increment_rotation!
    if self.metadata.current_rotation? && self.metadata.current_rotation
      self.metadata.current_rotation = self.metadata.current_rotation.to_i + 1
    else
      self.metadata.current_rotation = 1
    end
  end
  
  def increment_meetup!
    if self.metadata.current_meetup? && self.metadata.current_meetup
      self.metadata.current_meetup = self.metadata.current_meetup.to_i + 1
    else
      self.metadata.current_meetup = 1
    end
  end
  
  def announce_meetup_start!
    agent.event!(:meetup_start, {:team_name => self.team_name})
  end
  
  def assign_next_observation_location!    
    observed = observed_locations_in_current_rotation
    
    locs_left = current_locations - observed
    selected_loc = locs_left[rand(locs_left.length)]
    
    log "Assigning #{self} to #{selected_loc.inspect} for observations. (current task is #{self.metadata.current_task.inspect})"
    
    if self.metadata.current_task == "observe_present_presence" || self.metadata.state == 'OBSERVING_PRESENT'
      foo = Student::LOCATIONS[:day_2][selected_loc]
      selected_loc2 = foo[rand(foo.length)]
      log "Translated #{selected_loc.inspect} to #{selected_loc2.inspect} for #{self}."
      selected_loc = selected_loc2
    end
    
    self.agent.event!(:location_assignment,
      :location => selected_loc,
      :username => self.username
    )
  end
  
  def assign_meetup_location!
    # TODO: everyone in the group has to go to the same location
    meetups = mongo.collection(:meetups).find({"team" => self.team_name, "meetum_number" => self.current_meetup}).to_a
    if meetups.length > 1
      raise "Why are there multiple meetups for team #{self.team_name}? Something is *@&!@^%'ed!"
    elsif meetups.length == 0
      selected_loc = current_locations[rand(current_locations.length)]
      
      log "#{self} is the first one in their team at meetup ##{self.current_meetup}... Sending to #{selected_loc}."
      
      meetup = {
        "team" => self.team_name, 
        "started" => Time.now,
        "location" => selected_loc,
        "meetum_number" => self.current_meetup
      }
      
      mongo.collection(:meetups).save(meetup)
    else
      meetup = meetups.first
      
      selected_loc = meetup["location"]
      
      log "#{self}'s team is assembling for meetup ##{self.current_meetup} at #{selected_loc}."
    end
    
    agent.event!(:location_assignment,
      :location => selected_loc,
      :username => self.username
    )
  end
  
  def assign_brainstorm_location!
    locs = LOCATIONS[:brainstorm]
    selected_loc = locs[rand(locs.length)]
    
    log "Assigning #{self} to #{selected_loc.inspect} for meetup."
    
    self.agent.event!(:location_assignment,
      :location => selected_loc,
      :username => self.username
    )
  end
  
  def team_name
    groups.first.name
  end
  
  def translate_day_2_location(qr_loc)
    loc_map = {
      "borneo" => ["location_a", "location_b"],
      "sumatra" => ["location_c", "location_d"]
    }
    
    loc_map.each do |day_2_loc, qr_locs|
      return day_2_loc if qr_locs.include?(qr_loc)
    end
    
    raise "#{qr_loc.inspect} is not a valid day 2 location!"
  end
  
  define_statemachine(&StudentStatemachine)
end