require 'rubygems'
require 'mongo'
require 'json'

$: << "agents/sail.rb/lib"

RUNS = ['a','b','c','d'].collect{|alph| "michelle-feb-2012-#{alph}"}

require 'sail/rollcall/user'
require 'sail/rollcall/group'

json = File.read("config.json")
config = JSON.parse(json, :symbolize_names => true)

def error(msg)
  puts "\033[1;31m#{msg}\033[0;0m"
end

def okay(msg)
  puts "\033[32m#{msg}\033[0m"
end

bads = []

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
    next unless u.kind == "Student"
    
    # need to pull individually to get groups, since groups are not included in mass retrieve
    u = Rollcall::User.find(u.id)
    
    puts "  >> Checking metadata for #{u.account.login.inspect}..."
    bad = false
    required_metadata_keys.each do |key|
      unless u.metadata.send("#{key}?") && !u.metadata.send("#{key}").blank?
        error "    !!!! missing value for key '#{key}' !!!!" 
        bad = true
      end
    end
    
    json_metadata_keys.each do |key|
      begin
        JSON.parse(u.metadata.send("#{key}")) if u.metadata.send("#{key}?")
      rescue JSON::ParserError => e
        error "    !!!! bad JSON in key '#{key}': #{e} !!!!"
        bad = true
      end 
    end
    
    if u.metadata.assigned_organisms?
      begin
        JSON.parse(u.metadata.assigned_organisms).each do |org|
          unless File.exists?(File.dirname(__FILE__)+"/images/#{org}_icon.png")
            error "    !!!! missing image for organism #{org.inspect} !!!!"
            bad = true
          end
        end
      rescue JSON::ParserError
        # ignore
      end
    end
    
    if u.groups.length > 1
      error "    !!!! belongs to more than one group (#{u.groups.collect{|g| g.name}.inspect}) !!!!"
      bad = true
    elsif u.groups.length < 1
      error "    !!!! does not belong to a group !!!!"
      bad = true
    end
    
    
    if u.metadata.day? && u.metadata.day == 2
      unless u.metadata.state.blank? || u.metadata.state == 'OUTSIDE'
        error "    !!!! is in invalid state for day 2; must be OUTSIDE or blank !!!!"
        bad = true
      end
    end
    
    if bad
      bads << u
    else
      okay "     √ OK"
    end
  end
  
  puts "  DONE checking #{run}!"
end

puts
if bads.empty?
  okay "ALL USERS ARE OKAY!"
else
  error "!!!! #{bads.length} user#{bads.length == 1 ? " is" : "s are"} invalid:\n"
  bads.each do |u|
    error "  - #{u.account.login}"
  end
  puts
end