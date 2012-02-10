TEST_DB = "EvoRoom3-test"

require File.dirname(__FILE__)+'/event_expectations'

shared_context :stubbed_externals do
  before(:each) do
    # stub out ARes requests to avoid hitting Rollcall
    mzukowski_xml = IO.read(File.dirname(__FILE__)+'/mzukowski.xml')
    ActiveResource::HttpMock.respond_to do |mock|
      mock.get "/users/mzukowski.xml", {}, mzukowski_xml
      mock.put "/users/3.xml"
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

    # mock agent for delegates (like #log and #event!)
    agent = mock(:agent)
    agent.stub(:log)
    agent.class_eval do
      include(EventExpectations)
    end
    #agent.stub(:event!)
    @student.agent = agent
  end
end