require 'rubygems'
require 'mongo'
require 'json'

$: << "agents/sail.rb/lib"

RUNS = ['a','b','c','d'].collect{|alph| "michelle-feb-2012-#{alph}"}

require 'sail/rollcall/user'
require 'sail/rollcall/group'

json = File.read("config.json")
config = JSON.parse(json, :symbolize_names => true)

RUNS.each do |run|
  puts ">> Checking users in #{run.inspect}..."

  required_metadata_keys = ["assigned_organisms", "specialty"]
  json_metadata_keys = ["assigned_organisms"]

  Rollcall::Base.user = "rollcall"
  Rollcall::Base.password = "rollcall!"
  Rollcall::Base.site = config[:rollcall][:url]

  users_url = "/runs/#{run}/users.xml"
  full_url = Rollcall::Base.site.to_s + users_url
  puts "  >> Pulling users from #{full_url.inspect}..."
  
  Rollcall::User.format = :xml
  Rollcall::User.find(:all, :from => users_url).each do |u|
    puts "  >> Checking metadata for #{u.account.login.inspect}..."
    bad = false
    required_metadata_keys.each do |key|
      unless u.metadata.send("#{key}?") && !u.metadata.send("#{key}").blank?
        puts "    !!!! missing value for key '#{key}' !!!!" 
        bad = true
      end
    end
    json_metadata_keys.each do |key|
      begin
        u.metadata.send("#{key}")
      rescue JSON::ParserError => e
        puts "    !!!! bad JSON in key '#{key}': #{e} !!!!"
        bad = true
      end 
    end
    
    if u.metadata.assigned_organisms?
      JSON.parse(u.metadata.assigned_organisms).each do |org|
        unless File.exists?(File.dirname(__FILE__)+"/images/#{org}_icon.png")
          puts "    !!!! missing image for organism #{org.inspect} !!!!"
          bad = true
        end
      end
    end
    
    puts "     √ OK" unless bad
  end
  
  puts "  DONE checking #{run}!"
end

puts
puts "ALL DONE!"