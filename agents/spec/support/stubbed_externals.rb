TEST_DB = "EvoRoom3-test"

require File.dirname(__FILE__)+'/spec_helpers'
include SpecHelpers

shared_context :stubbed_externals do
  before(:each) do
    mock_active_resource
    
    reset_mongo_test_db
    
    # retrieve a @student for use in tests
    @student = Student.find('bobby')
  
    conn = Mongo::Connection.new
    test_mongo = conn.db(TEST_DB)
    @student.stub(:mongo) do
      test_mongo
    end
    
    log = File.open(File.dirname(__FILE__)+'/../../logs/rspec.log', 'a')
    
    # mock agent for delegates (like #log and #event!)
    agent = mock(:agent)
    agent.stub(:log) do |msg|
      log.puts msg
    end
    agent.class_eval do
      include(SpecHelpers)
    end
    #agent.stub(:event!)
    @student.agent = agent
  end
end