require 'eventmachine'
require 'em-websocket'


def get_id
end

class Player
  attr_reader :id
  attr_accessor :x
  attr_accessor :y
  
  def initialize(id, at_x, at_y);
    @id = self.object_id
    @x = at_x
    @y = at_y
  end
end

players = []

EventMachine::WebSocket.start(:host => "127.0.0.1", :port => 8080) do |ws|
  
  ws.onopen do
    puts "#{ws.object_id}"
    #create the player data and updated player info
     # players.push(Player.new(ws.id))
   end
  ws.onmessage { |msg| ws.send "Pong: #{msg}"; puts "#{ws}: #{msg}"; }
  ws.onclose   { puts "WebSocket closed" }
end