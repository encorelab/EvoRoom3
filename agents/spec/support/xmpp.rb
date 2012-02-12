XMPP_HOST = 'glint'
XMPP_PORT = 5222


require File.dirname(__FILE__)+'/spec_helpers'
include SpecHelpers

shared_context :xmpp do
  before(:each) do
    mock_active_resource
    
    reset_mongo_test_db
    
    # real xmpp agent!
    @spec = Speccer.new(:room => RUN, :password => AGENT_PASSWORD, :database => TEST_DB)
    
    @spec.config[:host] = XMPP_HOST
    @spec.config[:port] = XMPP_PORT
    
    @spec.log_to = File.open(File.dirname(__FILE__)+'/../../logs/Speccer-rspec.log','w')
  end
end