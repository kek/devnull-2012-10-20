require 'sinatra'
require 'json'

get '/' do
  "Hello World"
end

# use Rack::Auth::Basic do |username, password|
#   username == 'admin' && password == 'secret'
# end

get '/products.json' do
  [ { name: "Foo", type: "Variable", price: 100 },
    { name: "Bar", type: "Value", price: 200 },
    { name: "Baz", type: "Function", price: 1 } ].to_json
end
