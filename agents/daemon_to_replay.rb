$: << File.dirname(__FILE__)+"/sail.rb/lib"
$: << File.dirname(__FILE__)
require 'sail/daemon'

AGENT_PASSWORD = "9186ebc4790dfba833826e13c42c885f6f847274" # s3agent!

#RUNS = ['a','b','c','d'].collect{|alph| "michelle-feb-2012-#{alph}"}
RUNS = ['a'].collect{|alph| "michelle-feb-2012-#{alph}"}

@daemon = Sail::Daemon.spawn(
  :name => "evoroom-replay",
  :path => '.',
  :verbose => true
)

@daemon.load_config("../config.json")
ENV['ROLLCALL_URL'] = @daemon.config[:rollcall][:url]

require 'file_to_chat'

RUNS.each do |run|
  @daemon << FileToChat.new(:room => run, :password => AGENT_PASSWORD, :database => run)
end


@daemon.start
