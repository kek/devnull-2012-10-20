require 'sinatra'
require 'json'
require 'net/http'
require 'nokogiri'

set :public_folder, File.dirname(__FILE__) + '/static'

get '/' do
  "Hello World"
end


class User
  attr_accessor :username, :password

  def initialize(username, password)
    @username = username
    @password = password
  end

  def self.all
    userfile = open("users.txt")
    users = []
    userfile.lines.each do |line|
      x = line.split("|")
      user = User.new(x[0], x[1])
      users.push user
    end
    userfile.close
    users
  end

  def self.add(user)
    userfile = open("users.txt", "a+")
    userfile.write "#{user.username}|#{user.password}\n"
    userfile.close
  end

  def self.exists?(user)
    self.all.select {|u| u.username == user.username && u.password == user.password }.length > 0
  end
end

users = []

# use Rack::Auth::Basic do |username, password|
#   username == 'admin' && password == 'secret' or true
# end

post '/users' do
  User.add User.new(params[:username], params[:password])
  "Done"
end

get '/users' do
  content_type "text/plain"
  User.add(User.new("x","y"))
  User.all.map do |user|
    "#{user.username} #{user.password}\n"
  end.join
end


get '/login' do

end

post '/password' do

end


# Write a small service which let user register a name and password
# and then let them login as that user (with correct password)

# The only thing the user can do when logged in is change the
# password.
