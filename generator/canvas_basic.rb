# generator for getting started

# 0: title of the page

title = ARGV[0]

path = ARGV[1] || "./"

File.open(path+title+".html", "w+") do |f|
f.puts '<!DOCTYPE HTML>
<html>
<head>
  <title>'+title+'</title>
<style>
</style>

<script>
window.onload = function(){
  
}
</script>
</head>
<body>
  <div>
    <canvas id="canvas"></canvas>
  </div>
</body>
</html>
'
end