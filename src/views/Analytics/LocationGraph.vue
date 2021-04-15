<template>
  <div>
   <svg ref="location-graph-svg"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";

export default {
  name: "LocationGraph",
  methods: {
    initGraph() {
     const width = 500;
     const height = 270;

      // The svg
      const svg = d3.select(this.$refs['location-graph-svg'])
          .attr('width', width)
          .attr('height', height);

// Map and projection
//       var path = d3.geoPath();
      d3.geoPath();
      var projection = d3.geoMercator()
          .scale(70)
          .center([0, 20])
          .translate([width / 2, height / 2]);

// Data and color scale
      var data = d3.map();
      var colorScale = d3.scaleThreshold()
          .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
          .range(d3.schemeBlues[7]);

// Load external data and boot
      d3.queue()
          .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
          .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function (d) {
            data.set(d.code, +d.pop);
          })
          .await(ready);

      function ready(error, topo) {

        let mouseOver = function () {
          d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .5)
          d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1)
              .style("stroke", "black")
        }

        let mouseLeave = function () {
          d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .8)
          d3.select(this)
              .transition()
              .duration(200)
              .style("stroke", "transparent")
        }

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
              d.total = data.get(d.id) || 0;
              return colorScale(d.total);
            })
            .style("stroke", "transparent")
            .attr("class", function () {
              return "Country"
            })
            .style("opacity", .8)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
      }
    }
  },

  mounted() {
    this.initGraph();
  }
}
</script>

<style scoped>

</style>