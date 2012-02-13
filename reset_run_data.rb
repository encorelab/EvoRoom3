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
  puts ">> Resetting #{run.inspect}..."
  
  mongo = Mongo::Connection.new.db(run)

  puts "  >> Wiping data in mongo database #{run.inspect}..."
  mongo.collection(:location_tracking).remove()
  mongo.collection(:observations).remove()
  mongo.collection(:notes).remove()
  mongo.collection(:meetups).remove()

  keep_metadata_keys = ["assigned_organisms", "specialty", "assigned_backup", "key"]

  Rollcall::Base.user = "rollcall"
  Rollcall::Base.password = "rollcall!"
  Rollcall::Base.site = config[:rollcall][:url]

  users_url = "/runs/#{run}/users.xml"
  full_url = Rollcall::Base.site.to_s + users_url
  puts "  >> Pulling users from #{full_url.inspect}..."
  
  Rollcall::User.format = :xml
  Rollcall::User.find(:all, :from => users_url).each do |u|
    puts "  >> Wiping metadata for #{u.account.login.inspect}..."
    (u.metadata.attributes.keys).each do |key|
      unless keep_metadata_keys.include?(key)
        puts "     - #{key}"
        u.metadata.send("#{key}=", nil)
      end
      # begin
      #   g = Rollcall::Group.find(u.groups.first.id)
      #   if g
      #     puts "Clearing metadata for group #{g.name}"
      #     g.metadata.assigned_location_for_guess = nil
      #     g.save
      #   end
      # rescue NoMethodError
      #   puts "Not clearing group metadata for #{u.account.login.inspect}..."
      # end
    end
    u.save
  end
  
  puts
end