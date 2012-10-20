require 'sinatra'
require 'json'
require 'net/http'
require 'nokogiri'

get '/' do
  "Hello World"
end

# use Rack::Auth::Basic do |username, password|
#   username == 'admin' && password == 'secret'
# end

# Create a server which scrapes a newspaper for sections of text,
# randomly select ten words > 5 character long and scramble them.

# The scrambled words are sent to a client (in HTML/JS, for example),
# which present them to a user, who try to guess the word, which are
# sent back to the server and checked.

# Client should count number of tries and switch words when correct
# answer is found.

get '/newspaper/words' do
  headers 'Content-Type' => 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin' => '*'
  page = Net::HTTP.get('www.dn.se', '/')
  doc = Nokogiri::HTML(page)
  paragraphs = doc.search('p').map {|para| para.text }
  words = paragraphs.join(' ').split(' ').select { |w| w.length > 5 }.sort { |x,y| rand - 0.5 }.first(10)
  scrambled = words.map {|word|
    word.chars.sort { |x,y| rand - 0.5 }.join
  }
  wordfile = open('words.txt', 'w')
  wordfile.write(words)
  wordfile.close

  scrambled.to_json
end

post '/newspaper/guess' do
  content_type 'text/plain', charset: 'utf-8'
  guess = params[:guess]
  wordfile = open('words.txt')
  words = JSON.parse(wordfile.read)
  wordfile.close

  if words.member? guess
    status 200
    "Right"
  else
    status 404
    "Wrong"
  end
  # "The guess is #{guess}. " # + (words.member? guess ? "Correct!" : "Incorrect!")
end


# curl -v  --data "guess=hej" http://localhost:9393/newspaper/guess
