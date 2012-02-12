$: << File.dirname(__FILE__)+"/sail.rb/lib"
require 'sail/daemon'

require 'event_logger'
require 'location_tracker'
require 'choreographer'

AGENT_PASSWORD = "9186ebc4790dfba833826e13c42c885f6f847274" # s3agent!

RUNS = ['a','b','c','d'].collect{|alph| "michelle-feb-2012-#{alph}"}

@daemon = Sail::Daemon.spawn(
  :name => "evoroom",
  :path => '.',
  :verbose => true
)

@daemon.load_config("../config.json")

RUNS.each do |run|
  @daemon << EventLogger.new(:room => run, :password => AGENT_PASSWORD, :database => run)
  @daemon << LocationTracker.new(:room => run, :password => AGENT_PASSWORD, :database => run)
  @daemon << Choreographer.new(:room => run, :password => AGENT_PASSWORD, :database => run)
end


@daemon.start
