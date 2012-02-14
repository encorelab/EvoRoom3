require 'rubygems'
require 'blather/client/dsl'
require 'json'
require 'mongo'

$: << File.dirname(__FILE__)+'/sail.rb/lib'
require 'sail/agent'

require 'model/student'

class Speccer < Sail::Agent
  attr_accessor :chor
  
  def default_behaviour
    when_ready do
      join_room
      join_log_room
    end
    
    self_joined_log_room do |stanza|
      groupchat_logger_ready!
    end
  end
  
  def wait_for_state(state, &and_then)
    onetime_event(:state_change) do |stanza,data|
      data['payload']['to'].should == state
      EM.stop if data['payload']['to'] != state
      
      yield
    end
  end
  
  class Step
    attr_accessor :rest, :head, :nested
    
    def initialize
      self.rest = []
    end
    
    def call
      head.call(nested) if head
      rest.each{|lamb| lamb.call}
    end
  end
  
  
  def sequence
    @root = Step.new
    @root.head = lambda{}
    @cur = @root
    
    yield
    
    begin
      @root.call
    rescue => e
      EM.stop
      raise e
    end
  end
  
  def ev(event_type, data, opts = {})
    @cur.rest << lambda{
      scoped_data = data.respond_to?(:call) ? data.call : data
      log "ev: #{event_type} (#{scoped_data.inspect})"
      event!(event_type, scoped_data, opts)
    }
  end
  
  def wait(state)
    @cur.head = lambda{|nested|
      onetime_event(:state_change) do |stanza,data|
        data['payload']['to'].should == state
        #EM.stop if data['payload']['to'] != state
        log "state: #{state}"
        
        nested.call
      end
    }
    s = Step.new
    @cur.nested = s
    @cur = s
  end
  
  def on(event_type)
    @cur.rest << lambda{
      onetime_event(event_type) do |stanza,data|
        log "on: #{event_type} (#{data.inspect})"
        yield stanza,data
      end
    }
  end
  
  def meddle
    @cur.rest << lambda{
      yield
    }
  end
  
  def expect_student(&block)
    @cur.rest << lambda{
      student = chor.lookup_student(config[:nickname])
      student.instance_eval(&block)
    }
  end
  
  def finish
    @cur.rest << lambda{
      EM.stop
    }
  end
end
