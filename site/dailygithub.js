  var data = [ 
    [ ],
    [ ],
    [ ],
    [ ],
    [ ],
    [ ],
    [ ],
  ]

  var series = [
    "Repositories published",
    "Gists shared",
    "Commits pushed",
    "Issues opened",
    "Issues closed",
    "Issue comments",
    "Commit comments"
  ]

function generateStatsOverall() {

  var container = document.getElementById('timeline')
    , width = container.offsetWidth
    , i = 0
    , k = 0
    , gridWidth = width * 0.8
    , leftOfGrid = width - gridWidth
    , topOfGrid = 20 
    , spacePerQuad = gridWidth / 24
    , height = spacePerQuad * series.length + topOfGrid

  for(k in data) {
    var v = data[k]
    for(i = 0; i < 24; i++) {
      v.push({
        hour: i,
        value: Math.floor(Math.random() * 50 + 50)
      })
    }
  }

  var svg = d3.select("#timeline").append("svg")
          .attr("width", width)
          .attr("height", height)

   var hours = d3.range(0, 24, 1)

   svg.selectAll("line.vertical")
     .data(hours)
     .enter().append("svg:line")
     .attr("x1", function(d){return d * spacePerQuad + leftOfGrid;})
     .attr("y1", topOfGrid)
     .attr("x2", function(d){return d * spacePerQuad + leftOfGrid;})
     .attr("y2", spacePerQuad * series.length + topOfGrid)
     .style("stroke", "rgb(6,120,155)")
     .style("stroke-width", 1); 

   svg.selectAll("text.hour")
     .data(hours)
     .enter().append("svg:text")
     .attr("dy", "1em")
     .text(function(d) { return d; })
     .attr("x", function(d) { return d * spacePerQuad + leftOfGrid - (spacePerQuad / 2.0) })
     .attr("y", function(d) { return 0; })

  for(i = 0 ; i < series.length; i++) {
    var scale = d3.scale.linear()
       .domain([0, d3.max(data[i], function(d) { return d.value; })])
       .range([0, spacePerQuad / 2.0]);

     svg.append("svg:text")
       .attr("x", 0)
       .attr("y", topOfGrid + spacePerQuad * i + spacePerQuad/2)
       .text(series[i])

     svg.selectAll("circle.series-" + i)
      .data(data[i])
      .enter().append("svg:circle")
      .attr("cx", function(d) { return  leftOfGrid +  d.hour * (spacePerQuad) - spacePerQuad/2.0 })
      .attr("cy", topOfGrid + (spacePerQuad/2.0) + spacePerQuad * i)
      .attr("r", function(d) { return scale(d.value) })
  }
}
generateStatsOverall()

