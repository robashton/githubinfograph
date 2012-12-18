var colours = {
  "PushEvent": 'rgb(128, 0, 128)',
  "CommitCommentEvent": 'rgb(128, 128, 0)',
  "IssueEvent": 'rgb(0, 128, 128)',
  "CreateEvent": 'rgb(128, 0, 0)',
  "FollowEvent": 'rgb(0, 0, 128)',
  "ForkEvent": 'rgb(0, 128, 0)',
  "PullRequestEvent": 'rgb(255, 0, 128)',
  "PullRequestReviewCommentEvent": 'rgb(128, 0, 255)',
  "WatchEvent": 'rgb(0, 128, 255)',
  "GistEvent": 'rgb(255, 255, 0)',
  "GistCommentEvent": 'rgb(128, 128, 128)'
}

function generateStatsNow() {

  var container = document.getElementById('now')
    , width = container.offsetWidth
    , height = width / 4.0

  var svg = d3.select("#now").append("svg")
          .attr("width", width)
          .attr("height", height)

  $.getJSON('/now', function(data) {
    var start = Date.parse(data.start)
      , end = Date.parse(data.end)
    var horizontal = d3.scale.linear()
      .domain([ start, end  ])
      .range([0, width]);

    svg.selectAll("circle")
      .data(data.events)
      .enter().append('circle')
        .attr("cx", function(d) {
          return horizontal(Date.parse(d.created_at))
        })
        .attr("cy", function() {
          return Math.random() * (height  - 40) + 20
        })
        .attr("r", function() {
          return Math.random() * 5 + 5
        })
        .attr('fill', function(d) {
           var colour = colours[d.type]
           if(colour) 
             return colour
           else
             return 'rgb(0,0,0)'
        })
  })
}
generateStatsNow()
