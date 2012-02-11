require 'rubygems'
require 'blather/client/dsl'
require 'json'
require 'mongo'

$: << 'sail.rb/lib'
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
  
  def start_chain
    @chain = []
  end
  
  def end_chain
    begin
      @chain.shift.call
    rescue => e
      EM.stop
      raise e
    end
  end
  
  def ev(event_type, data, opts = {})
    @chain << lambda{
      scoped_data = data.respond_to?(:call) ? data.call : data
      log "ev: #{event_type} (#{scoped_data.inspect})"
      event!(event_type, scoped_data, opts)
      @chain.shift.call unless @chain.empty?
    }
  end
  
  def wait(state)
    @chain << lambda{
      onetime_event(:state_change) do |stanza,data|
        data['payload']['to'].should == state
        #EM.stop if data['payload']['to'] != state
        log "state: #{state}"
        
        @chain.shift.call unless @chain.empty?
      end
    }
  end
  
  def on(event_type)
    @chain << lambda{
      onetime_event(event_type) do |stanza,data|
        log "on: #{event_type} (#{data.inspect})"
        yield stanza,data
      end
      @chain.shift.call unless @chain.empty?
    }
  end
  
  def expect
    @chain << lambda{
      yield
      @chain.shift.call unless @chain.empty?
    }
  end
  
  def expect_student(&block)
    @chain << lambda{
      student = chor.lookup_student(config[:nickname])
      student.instance_eval(&block)
      @chain.shift.call unless @chain.empty?
    }
  end
  
  def finish
    @chain << lambda{
      EM.stop
    }
  end
end
