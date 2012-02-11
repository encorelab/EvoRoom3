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
  
  
  class Step
    attr_accessor :block, :steps, :children, :kind, :level
    def initialize(kind, &block)
      self.block = block if block
      self.steps = []
      self.children = []
      self.kind = kind.to_s
    end
    def call
      debugger
      if block
        block.call(proc{children.each{|c| c.call}})
      end
      steps.each{|s| s.call}
    end
    def inspect
      if block
        "#{kind.inspect}(\n#{"  "*level}#{steps.inspect}"
      else
        "#{kind.inspect} #{steps.inspect}"
      end
    end
  end
  
  def start_sequence
    @sequence_root = Step.new(:root)
    @sequence_root.level = 0
    @cur = @sequence_root
    @seq = []
  end
  
  def end_sequence
    
  end
  
  def run_sequence
    begin
      @sequence_root.call
    rescue => e
      EM.stop
      raise e
    end
  end
  
  def ev(event_type, data, opts = {})
    s = Step.new("ev #{event_type}")
    s.steps <<
      lambda{
        scoped_data = data.respond_to?(:call) ? data.call : data
        log "ev: #{event_type} (#{scoped_data.inspect})"
        event!(event_type, scoped_data, opts)
      }
    @seq << s
  end
  
  def wait(state)
    s = Step.new("wait #{state}")
    steps = @seq
    s.block =
      lambda{|nested|
        onetime_event(:state_change) do |stanza,data|
          data['payload']['to'].should == state
          #EM.stop if data['payload']['to'] != state
          log "state: #{state}"
        
          nested.call
        end
        steps
      }
    @seq = []
    s.level = @cur.level + 1
    @cur.steps << s
    @cur = s
  end
  
  def on(event_type)
    s = Step.new("on #{event_type}")
    s.steps <<
      lambda{
        onetime_event(event_type) do |stanza,data|
          log "on: #{event_type} (#{data.inspect})"
          yield stanza,data
        end
      }
    @seq << s
  end
  
  def expect
    s = Step.new(:expect)
    s.steps <<
      lambda{
        yield
      }
    @seq << s
  end
  
  def expect_student(&block)
    s = Step.new(:expect_student)
    s.steps <<
      lambda{
        student = chor.lookup_student(config[:nickname])
        student.instance_eval(&block)
      }
    @seq << s
  end
  
  def finish
    s = Step.new(:finish)
    s.steps <<
      lambda{
        EM.stop
      }
    @seq << s
  end
end
