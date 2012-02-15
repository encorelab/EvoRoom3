require 'rubygems'
require 'blather/client/dsl'
require 'blather/client/dsl'
require 'mongo'

$: << 'sail.rb/lib'
require 'sail/agent'

class FileToChat < Sail::Agent
  include Blather::DSL
  def behaviour
    when_ready do
      #@mongo = Mongo::Connection.new.db(config[:database])
      
      join_room
      #join_log_room
    end
    
    self_joined_log_room do |stanza|
      file_to_chat_ready!
    end
    
    # we don't specify an event type, so this will catch ALL events
    event :replay? do |stanza, data|
      log "Storing event: #{data.inspect}"
      #client.write "jdjdjdj"
      
      infile = File.new("replay_chat_a.txt", "r")
      linearray = infile.readlines
      infile.close

      linearray.each do |i|
        log i
        
        msg = Blather::Stanza::Message.new
        msg.to = room_jid
        msg.type = :groupchat
        msg.body = i

        client.write(msg)
      end
      
      #@mongo.collection(:events).save(data)
    end
    
    # event :check_in? do |stanza, data|
    #   iq = Sail::Query.new(:get)
    #   iq.query << "latest_user_locations"
    #   #iq.from = agent_jid_in_room
    #   iq.to = room_jid + "/LocationTracker"
    #   
    #   log "SENDING REQUEST #{client.object_id}: " + iq.inspect
    #   
    #   client.write_with_handler(iq) do |stanza|
    #     log "GOT RESPONSE #{client.object_id}: " + stanza.inspect
    #   end
    #   
    #   log client.instance_variable_get(:@tmp_handlers).inspect
    # end
  end
end
