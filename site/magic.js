(function(d3) {
  var svg = d3.select("#container").append("svg")
          .attr("height", "100%")
          .attr("width", "100%")

  introduction(svg)

})(this.d3)

function stepone(svg) {
  svg.selectAll(".outer")
    .transition()
    .duration(1000)
    .attr("opacity", 0.0)

}

function introduction(svg) {

  var outer = svg.append("g")
     .attr("class", "outer")

  outer.append("text")
      .attr("fill", '#000')
      .attr("x", "50%")
      .attr("y", "8%")
      .attr("text-anchor", "middle")
      .attr("font-size", "5em")
      .text("Github")


  function fact(x, y, text, colour) {
    var node = outer.append("g")

    node.append("circle")
        .attr("fill", colour)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", "18%")
        .attr("opacity", "0.9")
        .attr("filter", "url(#blur)")

    node.append("text")
        .attr("fill", '#000')
        .attr("dy", y)
        .attr("dx", x)
        .attr("font-size", "4em")
        .attr("text-anchor", "middle")
        .text(text)
  }

  fact("50%", "40%", "2.5m pushes", "#FAA")
  fact("19%", "40%", "3 months", "#AAF")
  fact("81%", "40%", "10m commits", "#FFA")


  var next = outer.append("g")
      .attr("cursor", "pointer")
      .on('click', function() {stepone(svg)})

  next.append("rect")
    .attr("fill", "#AFA")
    .attr("x", "30%")
    .attr("y", "70%")
    .attr("height", "20%")
    .attr("width", "40%")
    .attr("filter", "url(#blur)")

  next.append("text")
    .attr("fill", "#000")
    .attr("dx", "50%")
    .attr("dy", "82%")
    .attr("font-size", "4em")
    .attr("text-anchor", "middle")
    .text("Click to drill down...")

  outer.append("svg:defs")
    .append("svg:filter")
      .attr("id", "blur")
      .append("svg:feGaussianBlur")
        .attr("stdDeviation", 5);

}
