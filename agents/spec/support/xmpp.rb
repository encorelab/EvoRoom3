TEST_DB = "EvoRoom3-test"
AGENT_PASSWORD = "9186ebc4790dfba833826e13c42c885f6f847274" # s3agent!
RUN = "michelle-feb-2012-rspec"

require File.dirname(__FILE__)+'/event_expectations'

shared_context :xmpp do
  before(:each) do
    # stub out ARes requests to avoid hitting Rollcall
    mzukowski_xml = IO.read(File.dirname(__FILE__)+'/mzukowski.xml')
    peterbelk_xml = IO.read(File.dirname(__FILE__)+'/PeterBelk.xml')
    
    ActiveResource::HttpMock.respond_to do |mock|
      mock.get "/users/mzukowski.xml", {}, mzukowski_xml
      mock.put "/users/3.xml"
      
      mock.get "/users/PeterBelk.xml", {}, peterbelk_xml
      mock.put "/users/53.xml"
    end
    
    Student.format = :xml
    Student.site = "http://rollcall.proto.encorelab.org"
    
    
    # use TEST_DB in mongo instead of real DB
    conn = Mongo::Connection.new
    conn.drop_database(TEST_DB)
    test_mongo = conn.db(TEST_DB)
    
    # retrieve a @student for use in tests
    @student = Student.find('mzukowski')
  
    @student.stub(:mongo) do
      test_mongo
    end

    # real xmpp agent!
    @chor = Choreographer.new(:room => RUN, :password => AGENT_PASSWORD, :database => TEST_DB)
    
    @spec = Speccer.new(:room => RUN, :password => AGENT_PASSWORD, :database => TEST_DB)
    
    @chor.config[:host] = 'proto.encorelab.org'
    @chor.config[:port] = 5222
    @chor.config[:sail] = {:rollcall => {:url => Student.site}}
    
    @spec.config[:host] = 'proto.encorelab.org'
    @spec.config[:port] = 5222
    
    @chor.log_to = File.open(File.dirname(__FILE__)+'/../../logs/Choreographer.log','w')
    #@spec.log_to = File.open(File.dirname(__FILE__)+'/../../logs/Speccer.log','w')
    
    @chor.class_eval do
      include(EventExpectations)
    end
    
    @chor.catch_event_exceptions = false
    @spec.catch_event_exceptions = false
    
    @spec.chor = @chor
    @student.agent = @chor
  end
end