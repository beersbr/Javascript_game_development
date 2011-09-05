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
		# puts l
	end
end


