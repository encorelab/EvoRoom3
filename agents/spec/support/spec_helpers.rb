AGENT_PASSWORD = "9186ebc4790dfba833826e13c42c885f6f847274" # s3agent!
RUN = "michelle-feb-2012-a-test"
TEST_DB = "michelle-feb-2012-a-test"

SAIL_CONFIG = {:rollcall => {:url => "http://localhost:3000"}}

module SpecHelpers
  def mock_active_resource
    # stub out ARes requests to avoid hitting Rollcall
    @json = {}
    Dir.glob(File.dirname(__FILE__)+'/**/*.json').each do |file|
      type = File.dirname(file).split("/").last
      basename = File.basename(file)
      @json["#{type}/#{basename}"] = IO.read(file)
    end
  
    ActiveResource::HttpMock.respond_to do |mock|
      @json.each do |file,data|
        type = File.dirname(file).split("/").last
        basename = File.basename(file)
        rec_id = JSON.parse(data)['id']
        mock.get "/#{type}/#{basename}", {}, data
        mock.get "/#{type}/#{rec_id}.json", {}, data
        mock.put "/#{type}/#{rec_id}.json"
      end
      mock.get "/users/Matt%20Zukowski.json", {}, nil, 404
    end
    
    Rollcall::Base.site = SAIL_CONFIG[:rollcall][:url]
    Rollcall::Base.format = :json
    
    Student.format = :json
    Rollcall::Group.format = :json
    Rollcall::User.format = :json
  end
  
  def should_receive_event(event_type, data = nil, opts = nil)
    if data && opts
      self.should_receive(:event!).with(event_type, data.kind_of?(Hash) ? data.symbolize_keys : data, opts.kind_of?(Hash) ? opts.symbolize_keys : opts)
    elsif data
      self.should_receive(:event!).with(event_type, data.kind_of?(Hash) ? data.symbolize_keys : data)
    else
      self.should_receive(:event!).with(event_type)
    end
  end
  
  def reset_mongo_test_db
    # use TEST_DB in mongo instead of real DB
    conn = Mongo::Connection.new
    conn.drop_database(TEST_DB)
  end
end