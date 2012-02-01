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
  
  def store_currently_assigned_location(loc)
    student.metadata.currently_assigned_location = loc
  end
  
  def store_organism_observation(observation)
    log "Storing organism observation: #{observation.inspect}"
    mongo.collection(:organism_observations).save(observation)
  end
  
  def store_meetup_note(note)
    raise NotImplementedError
  end
  
  def rotation_completed?
    #mongo.collection(:organism_observations).find({})
    raise NotImplementedError
  end
  
  def guess_received_for_all_locations?(guess)
    store_rainforest_guess(guess)
    received = mongo.collection(:rainforest_guesses).find({'group_code' => guess['group_code']}).to_a
    agent.log "Group #{guess['group_code'].inspect} has so far submitted #{received.count} guesses..."
    have_all = RAINFORESTS.all?{|loc| received.any?{|r| r['location'] == loc}}
    
    log "#{self} has not yet submitted a guess for all locations" unless have_all
    
    return have_all
  end
  
  def interview_submitted_for_all_interviewees?(interview = nil)
    mongo.collection(:interviews).save(interview) if interview
    
    int_1 = nil
    begin
      int_1 = metadata.interviewee_1
    rescue NoMethodError
    end
    
    int_2 = nil
    begin
      int_2 = metadata.interviewee_2
    rescue NoMethodError
    end
    
    log "#{self}'s interviewees: #{int_1.inspect} and #{int_2.inspect}"
    
    if int_1
      have_first = mongo.collection(:interviews).find({:author => username, :interviewee => int_1}).count > 0
    end
    
    if int_2
      have_second = mongo.collection(:interviews).find({:author => username, :interviewee => int_2}).count > 0
    end
    
    log "#{self} --> have_first => #{have_first} & have_second => #{have_second}"
    if have_first && have_second
      log "#{self} has completed all required interviews"
      return true
    else
      still_left = []
      still_left << int_1 if !have_first
      still_left << int_2 if !have_second
      log "#{self} must still interview #{still_left.inspect}"
      return false
    end
  end
  
  def all_usernames_currently_in_smartroom
    # locs = mongo.collection(:location_tracking).find({'latest' => true}).to_a
    # locs.delete_if{|loc| Time.parse(loc['timestamp']) > Time.now - 20.minutes}
    # return locs.collect{|loc| loc['username']}
    
    
    Rollcall::Group.site = Student.site
    section = self.group_code[0..0] # just the letter part
    all_evo_groups = (1..4).map{|i| "#{section}#{i}"}.map{|name| Rollcall::Group.find(name)}
    usernames = []
    all_evo_groups.each {|g| usernames += g.members.collect{|u| u.account.login} }
    
    return usernames
  end
  
  def determine_interviewees
    possible_interviewee_usernames = all_usernames_currently_in_smartroom
    
    my_group_members = group_members
    
    possible_interviewee_usernames -= [self.username] # remove self
    possible_interviewee_usernames -= my_group_members.collect{|m| m.account.login} # remove own group members
    
    my_group_members_interviewees = [] 
    my_group_members.each do |m|
      begin
        my_group_members_interviewees << m.metadata.interviewee_1 if m.metadata.interviewee_1
        my_group_members_interviewees << m.metadata.interviewee_2 if m.metadata.interviewee_2
      rescue NoMethodError
      end
    end
    
    log "#{self}'s group has already been assigned the following interviewees: #{my_group_members_interviewees.inspect}"
    
    if [possible_interviewee_usernames - my_group_members_interviewees].length >= 2
      possible_interviewee_usernames -= my_group_members_interviewees
    end
    
    log "Assigning interviewees to #{self} (selecting from users: #{possible_interviewee_usernames.inspect})..."
    
    # possible_interviewees = []
    #     possible_interviewee_usernames.each do |u|
    #       possible_interviewees << Student.find(u)
    #     end
    
    first = possible_interviewee_usernames[rand(possible_interviewee_usernames.length)]
    possible_interviewee_usernames -= [first]
    second = possible_interviewee_usernames[rand(possible_interviewee_usernames.length)]
    
    return [first, second]
  end
  
  # def store_assigned_organisms(organisms)
  #   (1..organisms.length).each do |i|
  #     metadata.send("assigned_organism_#{i}=", organisms[i-1])
  #   end
  # end
  
  
  def determine_next_location_for_guess
    if group_location_assignment
      location = group_location_assignment
      log "Student #{username.inspect}'s group (#{group_code.inspect}) already assigned to #{location.inspect}; sending student there..."
    else
      remaining = Student::RAINFORESTS - rainforests_that_the_user_has_submitted_a_guess_for
      location = remaining[rand(remaining.length)]
      
      log "Assigning #{location.inspect} to #{username.inspect} (#{group_code.inspect}); remaining locations: #{remaining.inspect}"
      
      self.group_location_assignment = location
    end
    
    return location
  end
  
  def determine_rationale
    members_usernames = group_members.collect{|m| m.account.login}
    possible_rationales = ["strategy", "evidence", "additional_info"]
    
    rationale_idx = nil
    (0..members_usernames.length).each do |i|
      rationale_idx = i if self.username == members_usernames[i]
      # blah
    end
    
    return possible_rationales[rationale_idx]
  end
  
  def store_organism_presence(presence)
    #metadata.send("#{presence['location']_checked_for_presence}=", true)
    log "Storing presence: #{presence.inspect}"
    mongo.collection(:organism_presence).save(presence)
  end
  
  def organism_presence_received_for_all_locations?(presence)
    store_organism_presence(presence)
    received = mongo.collection(:organism_presence).find({'username' => username}).to_a
    have_all = RAINFORESTS.all?{|loc| received.any?{|r| r['location'] == loc}}
    
    log "#{self} has not yet submitted a presence observation for all locations" unless have_all
    
    return have_all
  end
  
  def group_members
    group = self.evoroom_group
    group.members
  end
  
  def group_members_current_locations
    current_locations = {}
    group_members.each do |m| 
      # TODO: use Sail::Query instead
      latest = mongo.collection(:location_tracking).find_one({'latest' => true, 'username' => m.account.login})
      current_locations[m.account.login] = latest && latest['location']
    end
    log "#{self}'s group members' current loations: #{current_locations.inspect}"
    return current_locations
  end
  
  def all_group_members_at_my_assigned_location?
    raise "#{self} is not currently assigned to a location!" unless metadata.currently_assigned_location
    my_assigned_location = metadata.currently_assigned_location
    
    at_my_location = []
    not_at_my_location = []
    
    # HACK ALERT!
    curr_locs = group_members_current_locations
    curr_locs[self.username] = metadata.currently_assigned_location
    curr_locs.each do |username, location| 
      if location == my_assigned_location && agent.lookup_student(username).state == self.state
        at_my_location << username
      else
        not_at_my_location << username
      end
    end
    
    if not_at_my_location.empty?
      log "#{self} has all group members at their assigned location (#{at_my_location.inspect} at #{my_assigned_location.inspect}). Yay!"
      return true
    else
      log "#{self} still waiting on #{not_at_my_location.inspect}..."
      return false
    end
  end
  
  def announce_completed_rainforests
    completed_rainforests = mongo.collection(:organism_presence).find('username' => username).
      to_a.collect{|p| p['location']}.uniq.select{|r| r =~ /rainforest/}
    
    log "#{self} has submitted a presence observation for: #{completed_rainforests.inspect}"
    
    agent.event!(:rainforests_completed_announcement, {
      :username => username,
      :completed_rainforests => completed_rainforests
    })
  end
  
  def rainforests_that_the_user_has_submitted_a_guess_for
    mongo.collection(:rainforest_guesses).find('group_code' => group_code).
      to_a.collect{|p| p['location']}.uniq
  end
  
  def group_location_assignment
    group = self.evoroom_group
    begin
      !group.metadata.assigned_location_for_guess.blank? && group.metadata.assigned_location_for_guess
    rescue NoMethodError # FIXME: shouldn't throw this if metadata is missing
      nil
    end
  end
  
  def group_location_assignment=(location)
    group = self.evoroom_group
    group.metadata.assigned_location_for_guess = location
    log "Setting group location for #{self} to #{location.inspect}"
    group.save
  end
  
  def clear_group_location_assignment
    group = self.evoroom_group
    group.metadata.assigned_location_for_guess = nil
    log "Clearing group location for #{self}"
    group.save
  end
  
  define_statemachine(&StudentStatemachine)
end