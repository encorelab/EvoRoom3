AGENT_PASSWORD = "9186ebc4790dfba833826e13c42c885f6f847274" # s3agent!
RUN = "michelle-feb-2012-a-test"
TEST_DB = "michelle-feb-2012-a-test"

XMPP_HOST = 'glint'
XMPP_PORT = 5222
SAIL_CONFIG = {:rollcall => {:url => "http://localhost:3000"}}

require File.dirname(__FILE__)+'/event_expectations'

shared_context :xmpp do
  before(:each) do
    # stub out ARes requests to avoid hitting Rollcall
    json = {}
    Dir.glob(File.dirname(__FILE__)+'/*.json').each do |file|
      json[file] = IO.read(file)
    end
    
    ActiveResource::HttpMock.respond_to do |mock|
      json.each do |file,data|
        user_id = JSON.parse(data)['id']
        mock.get "/users/#{File.basename(file)}", {}, data
        mock.put "/users/#{user_id}.json"
      end
      mock.get "/users/Matt%20Zukowski.json", {}, nil, 404
    end
    
    Student.format = :json
    Student.site = SAIL_CONFIG[:rollcall][:url]

    # real xmpp agent!
    @spec = Speccer.new(:room => RUN, :password => AGENT_PASSWORD, :database => TEST_DB)
    

    
    @spec.config[:host] = XMPP_HOST
    @spec.config[:port] = XMPP_PORT
    

    @spec.log_to = File.open(File.dirname(__FILE__)+'/../../logs/Speccer.log','w')
  end
end