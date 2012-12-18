function generateStatsOverall(data, series) {

  var container = document.getElementById('timeline')
    , width = container.offsetWidth
    , i = 0
    , k = 0
    , gridWidth = width * 0.8
    , leftOfGrid = width - gridWidth
    , topOfGrid = 20 
    , spacePerQuad = gridWidth / 24
    , height = spacePerQuad * series.length + topOfGrid

  var svg = d3.select("#timeline").append("svg")
          .attr("width", width)
          .attr("height", height)

   var hours = d3.range(0, 24, 1)

   svg.selectAll("text.hour")
     .data(hours)
     .enter().append("svg:text")
     .attr("dy", "1em")
     .text(function(d) { return d; })
     .attr("x", function(d) { return d * spacePerQuad + leftOfGrid - (spacePerQuad / 2.0) })
     .attr("y", function(d) { return 0; })

  for(i = 0 ; i < series.length; i++) {

    var scale = d3.scale.linear()
       .domain([0, d3.max(data[i], function(d) { return d || 0 })])
       .range([0, spacePerQuad]);

     svg.append("svg:text")
       .attr("x", 0)
       .attr("y", topOfGrid + spacePerQuad * i + spacePerQuad/2)
       .text(series[i])

     svg.selectAll("line.series-" + i)
      .data(data[i])
      .enter().append("svg:line")
      .attr("x1", function(d, hour) { 
          return  leftOfGrid +  hour * (spacePerQuad) - spacePerQuad/2.0 })
      .attr("x2", function(d, hour) { 
          return  leftOfGrid +  (hour+1) * (spacePerQuad) - spacePerQuad/2.0 })
      .attr("y1", topOfGrid + (spacePerQuad/2.0) + spacePerQuad * i)
      .attr("y2", topOfGrid + (spacePerQuad/2.0) + spacePerQuad * i)
      .attr("stroke-width", function(d) { console.log(d);  return scale(d || 0) })
      .attr('stroke', "rgb(128,0,128)")
  }
}

function updateToday(totals) {
  $('#total-repositories').text(totals.repocreated || 0)
  $('#total-gists').text(totals.gistcreated || 0)
  $('#total-commits').text(totals.pushes || 0)
  $('#total-pullrequests').text(totals.pullrequestopened || 0)
  $('#total-issues-opened').text(totals.issuesopened || 0)
  $('#total-issue-comments').text(totals.issuecomments || 0)
  $('#total-issues-closed').text(totals.issuesclosed || 0)
  $('#total-commit-comments').text(totals.commitcomments || 0)
}

$.getJSON('/today', function(data) {
  updateToday(data.totals)
  var series = []
  var seriesData = []

  for(var i in data.hourly) {
    series.push(i)
    seriesData.push(data.hourly[i])
  }
  generateStatsOverall(seriesData, series)
})


