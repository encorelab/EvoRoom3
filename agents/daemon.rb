$: << "sail.rb/lib"
require 'sail/daemon'

require 'event_logger'
require 'location_tracker'
require 'choreographer'

AGENT_PASSWORD = "9186ebc4790dfba833826e13c42c885f6f847274" # s3agent!
RUN = "michelle-fall-2011"
DB = "evoroom"

@daemon = Sail::Daemon.spawn(
  :name => "evoroom",
  :path => '.',
  :verbose => true
)

@daemon.load_config("../config.json")

# A run 1
@daemon << EventLogger.new(:room => RUN, :password => AGENT_PASSWORD, :database => DB)
@daemon << LocationTracker.new(:room => RUN, :password => AGENT_PASSWORD, :database => DB)
@daemon << Choreographer.new(:room => RUN, :password => AGENT_PASSWORD, :database => DB)

# A run 2
#@daemon << Archivist.new(:room => "evoroom-a2", :password => AGENT_PASSWORD, :database => 'evoroom')
#@daemon << Notetaker.new(:room => "evoroom-a2", :password => AGENT_PASSWORD, :database => 'evoboard')


@daemon.start
#@daemon.start_interactive