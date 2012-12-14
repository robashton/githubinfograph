function generateStatsNow() {

  var container = document.getElementById('now')
    , width = container.offsetWidth
    , height = width / 2.0

  var svg = d3.select("#now").append("svg")
          .attr("width", width)
          .attr("height", height)

  var horizontal = d3.scale.linear()
     .domain([0, d3.max(data[i], function(d) { return d.value; })])
     .range([0, spacePerQuad / 2.0]);
  

  $.getJSON('/now', function(data) {

  })
}
