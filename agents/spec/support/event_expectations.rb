module EventExpectations
  def should_receive_event(event_type, data = nil, opts = nil)
    if data && opts
      self.should_receive(:event!).with(event_type, data.kind_of?(Hash) ? data.symbolize_keys : data, opts.kind_of?(Hash) ? opts.symbolize_keys : opts)
    elsif data
      self.should_receive(:event!).with(event_type, data.kind_of?(Hash) ? data.symbolize_keys : data)
    else
      self.should_receive(:event!).with(event_type)
    end
  end
end