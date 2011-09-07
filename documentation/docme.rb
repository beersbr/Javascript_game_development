#ruby documentation file for javascript

args = /(([A-Za-z0-9_-]*),? ?)*/m
object = /function ([A-Z][a-z0-9A-Z_-]*)\((#{args})\)/m
# namespace = /([A-Z][a-zA-Z_]*) ?= ?\{\}/m
# namespace_function = /([A-Z][a-zA-Z_]*)\.([a-zA-Z_0-9]*)\((#{args})\)/
object_function = /this\.([a-z][a-z0-9A-Z_]*) ?= ?function\((#{args})\)/
function = /function ([a-z][a-z0-9A-Z_-]*)\((#{args})\)/m
extended = /([A-Z][a-z0-9_A-Z]*)\.prototype\.([a-z][a-zA-Z_0-9]*) ?= ?function\((#{args})\)/m

docme_file_list = %w(../javascripts/games_common_v0.2.js);
current_line = 0;

docme_file_list.each do |f|
	fp = File.open(f, "r")
  puts "-----------------------------------------"
  puts "#{f}"
  puts "-----------------------------------------"
	fp.readlines.each do |l|
    current_line += 1;
		if(l =~ object)
      puts "#{current_line}: Found Object: #{$1}(#{$2})"
      next
    elsif(l =~ object_function)
      puts "#{current_line}: Found Member Function: #{$1}(#{$2})"
      next
    elsif(l =~ function)
      puts "#{current_line}: Found Function: #{$1}(#{$2})"
      next
    elsif(l =~ extended)
      puts "#{current_line}: Found Extended: #{$1}::#{$2}(#{$3})"
      next
    end
	end
end


