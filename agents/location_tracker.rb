require 'rubygems'
require 'blather/client/dsl'
require 'json'
require 'mongo'

$: << 'sail.rb/lib'
require 'sail/agent'

class LocationTracker < Sail::Agent
  def behaviour
    when_ready do
      @mongo = Mongo::Connection.new.db(config[:database])
      
      join_room
      join_log_room
    end
    
    event :check_in? do |stanza, data|
      who = data['origin']
      location = data['payload']['location']
      timestamp = data['timestamp']
      
      check_in_user_at(who, location, timestamp)
    end
    
    self_joined_log_room do |stanza|
      groupchat_logger_ready!
    end
    
    #iq '/iq/ns:query', :ns => Sail::Query::NS do |stanza|
    iq do |stanza|
      if stanza.type == :get && stanza.id.include?("blather")
        log "GOT REQUEST #{client.object_id}: "+stanza.inspect
        iq = Sail::Query.new(:result)
        iq.id = stanza.id
        iq.query << latest_user_locations.to_json
        #iq.to = room_jid+"/EventLogger"#stanza.from
        iq.to = stanza.from
        #iq.from = agent_jid_in_room
        log "SENDING RESPOSNE #{client.object_id}:" + iq.inspect
        client.write iq
      end
    end
  end
  
  def check_in_user_at(username, location, timestamp = nil)
    current_loc = @mongo.collection(:location_tracking).find_one(
        {'username' => username},
        {:sort => [:timestamp, Mongo::DESCENDING]}
      )
    
    
    if (current_loc)
      current_loc['latest'] = false
      @mongo.collection(:location_tracking).save(current_loc)
    else
      current_loc = {'username' => username}
    end
    
    log "#{username.inspect} checking in at #{location.inspect} (previously at #{current_loc['location'].inspect})"
    
    new_loc = {}
    new_loc['username'] = username
    new_loc['location'] = location
    new_loc['timestamp'] = timestamp || Time.now
    new_loc['latest'] = true
    @mongo.collection(:location_tracking).save(new_loc)
  end
  
  def latest_user_locations
    @mongo.collection(:location_tracking).find(:latest => true).to_a
  end
end
