#ruby documentation file for javascript

args = /(([A-Za-z0-9_-]*),? ?)*/m
object = /function ([A-Z][a-z0-9A-Z_-]*)\((#{args})\)/m
object_function = /this\.([a-z][a-z0-9A-Z_]*) ?= ?function\((#{args})\)/m
function = /function ([a-z][a-z0-9A-Z_-]*)\((#{args})\)/m
extended = /([A-Z][a-z0-9_A-Z]*)\.prototype\.([a-z][a-zA-Z_0-9]*) ?= ?function\((#{args})\)/m

docme_file_list = %w(../javascripts/games_common_v0.2.js);

docme_file_list.each do |f|
	fp = File.open(f, "r")

	fp.readlines.each do |l|
		if(l =~ object)
      puts "Found Object: #{$1}(#{$2})"
    elsif(l =~ object_function)
      puts "Found Member Function: #{$1}(#{$2})"      
    elsif(l =~ function)
      puts "Found Function: #{$1}(#{$2})"      
    elsif(l =~ extended)
      puts "Found Extended: #{$1} => #{$2}(#{$3})"      
    end
	end
end


