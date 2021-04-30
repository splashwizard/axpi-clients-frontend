<template>
  <div class="graph-container">
    <ResponsiveHeatmap
        :keys="keys"
        :data="data"
        indexBy="country"
        :margin="{ top: 100, right: 60, bottom: 60, left: 60 }"
        :forceSquare="true"
        :axisTop="{ orient: 'top', tickSize: 5, tickPadding: 5, tickRotation: -90, legend: '', legendOffset: 36 }"
        :axisRight="null"
        :axisBottom="null"
        :axisLeft="{orient: 'left', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'country', legendPosition: 'middle', legendOffset: -40}"
        ]
        :cellOpacity="1"
        :cellBorderColor="{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }"
        :labelTextColor="{ from: 'color', modifiers: [ [ 'darker', 1.8 ] ] }"
        :defs="[
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(0, 0, 0, 0.1)',
                rotation: -45,
                lineWidth: 4,
                spacing: 7
            }
        ]"
        :fill="[ { id: 'lines' } ]"
        :animate="true"
        motionConfig="wobbly"
        :motionStiffness="80"
        :motionDamping="9"
        hoverTarget="cell"
        :cellHoverOthersOpacity="0.25"
        class="heatmap"/>

  </div>
</template>

<script>
import ResponsiveHeatmap from "@nivo/heatmap";

const data = [
  {
    "country": "AD",
    "hot dog": 77,
    "hot dogColor": "hsl(172, 70%, 50%)",
    "burger": 18,
    "burgerColor": "hsl(145, 70%, 50%)",
    "sandwich": 63,
    "sandwichColor": "hsl(130, 70%, 50%)",
    "kebab": 38,
    "kebabColor": "hsl(215, 70%, 50%)",
    "fries": 61,
    "friesColor": "hsl(123, 70%, 50%)",
    "donut": 21,
    "donutColor": "hsl(281, 70%, 50%)",
    "junk": 62,
    "junkColor": "hsl(301, 70%, 50%)",
    "sushi": 63,
    "sushiColor": "hsl(285, 70%, 50%)",
    "ramen": 8,
    "ramenColor": "hsl(19, 70%, 50%)",
    "curry": 65,
    "curryColor": "hsl(59, 70%, 50%)",
    "udon": 30,
    "udonColor": "hsl(101, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 24,
    "hot dogColor": "hsl(301, 70%, 50%)",
    "burger": 78,
    "burgerColor": "hsl(3, 70%, 50%)",
    "sandwich": 77,
    "sandwichColor": "hsl(186, 70%, 50%)",
    "kebab": 45,
    "kebabColor": "hsl(151, 70%, 50%)",
    "fries": 94,
    "friesColor": "hsl(199, 70%, 50%)",
    "donut": 15,
    "donutColor": "hsl(359, 70%, 50%)",
    "junk": 25,
    "junkColor": "hsl(343, 70%, 50%)",
    "sushi": 6,
    "sushiColor": "hsl(176, 70%, 50%)",
    "ramen": 54,
    "ramenColor": "hsl(156, 70%, 50%)",
    "curry": 41,
    "curryColor": "hsl(302, 70%, 50%)",
    "udon": 58,
    "udonColor": "hsl(235, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 67,
    "hot dogColor": "hsl(128, 70%, 50%)",
    "burger": 72,
    "burgerColor": "hsl(219, 70%, 50%)",
    "sandwich": 56,
    "sandwichColor": "hsl(345, 70%, 50%)",
    "kebab": 77,
    "kebabColor": "hsl(110, 70%, 50%)",
    "fries": 5,
    "friesColor": "hsl(37, 70%, 50%)",
    "donut": 19,
    "donutColor": "hsl(327, 70%, 50%)",
    "junk": 94,
    "junkColor": "hsl(18, 70%, 50%)",
    "sushi": 0,
    "sushiColor": "hsl(167, 70%, 50%)",
    "ramen": 12,
    "ramenColor": "hsl(180, 70%, 50%)",
    "curry": 72,
    "curryColor": "hsl(126, 70%, 50%)",
    "udon": 14,
    "udonColor": "hsl(49, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 24,
    "hot dogColor": "hsl(90, 70%, 50%)",
    "burger": 65,
    "burgerColor": "hsl(56, 70%, 50%)",
    "sandwich": 48,
    "sandwichColor": "hsl(286, 70%, 50%)",
    "kebab": 100,
    "kebabColor": "hsl(233, 70%, 50%)",
    "fries": 51,
    "friesColor": "hsl(244, 70%, 50%)",
    "donut": 75,
    "donutColor": "hsl(311, 70%, 50%)",
    "junk": 100,
    "junkColor": "hsl(142, 70%, 50%)",
    "sushi": 84,
    "sushiColor": "hsl(36, 70%, 50%)",
    "ramen": 12,
    "ramenColor": "hsl(241, 70%, 50%)",
    "curry": 11,
    "curryColor": "hsl(268, 70%, 50%)",
    "udon": 34,
    "udonColor": "hsl(287, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 39,
    "hot dogColor": "hsl(18, 70%, 50%)",
    "burger": 67,
    "burgerColor": "hsl(176, 70%, 50%)",
    "sandwich": 19,
    "sandwichColor": "hsl(136, 70%, 50%)",
    "kebab": 51,
    "kebabColor": "hsl(175, 70%, 50%)",
    "fries": 53,
    "friesColor": "hsl(93, 70%, 50%)",
    "donut": 24,
    "donutColor": "hsl(10, 70%, 50%)",
    "junk": 89,
    "junkColor": "hsl(136, 70%, 50%)",
    "sushi": 25,
    "sushiColor": "hsl(253, 70%, 50%)",
    "ramen": 80,
    "ramenColor": "hsl(270, 70%, 50%)",
    "curry": 83,
    "curryColor": "hsl(340, 70%, 50%)",
    "udon": 15,
    "udonColor": "hsl(302, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 52,
    "hot dogColor": "hsl(85, 70%, 50%)",
    "burger": 0,
    "burgerColor": "hsl(8, 70%, 50%)",
    "sandwich": 17,
    "sandwichColor": "hsl(315, 70%, 50%)",
    "kebab": 79,
    "kebabColor": "hsl(93, 70%, 50%)",
    "fries": 40,
    "friesColor": "hsl(182, 70%, 50%)",
    "donut": 59,
    "donutColor": "hsl(228, 70%, 50%)",
    "junk": 21,
    "junkColor": "hsl(75, 70%, 50%)",
    "sushi": 55,
    "sushiColor": "hsl(29, 70%, 50%)",
    "ramen": 30,
    "ramenColor": "hsl(45, 70%, 50%)",
    "curry": 97,
    "curryColor": "hsl(119, 70%, 50%)",
    "udon": 87,
    "udonColor": "hsl(300, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 82,
    "hot dogColor": "hsl(64, 70%, 50%)",
    "burger": 89,
    "burgerColor": "hsl(254, 70%, 50%)",
    "sandwich": 27,
    "sandwichColor": "hsl(77, 70%, 50%)",
    "kebab": 22,
    "kebabColor": "hsl(277, 70%, 50%)",
    "fries": 92,
    "friesColor": "hsl(208, 70%, 50%)",
    "donut": 75,
    "donutColor": "hsl(183, 70%, 50%)",
    "junk": 10,
    "junkColor": "hsl(2, 70%, 50%)",
    "sushi": 33,
    "sushiColor": "hsl(270, 70%, 50%)",
    "ramen": 74,
    "ramenColor": "hsl(332, 70%, 50%)",
    "curry": 10,
    "curryColor": "hsl(149, 70%, 50%)",
    "udon": 8,
    "udonColor": "hsl(110, 70%, 50%)"
  },
  {
    "country": "AO",
    "hot dog": 54,
    "hot dogColor": "hsl(137, 70%, 50%)",
    "burger": 83,
    "burgerColor": "hsl(222, 70%, 50%)",
    "sandwich": 49,
    "sandwichColor": "hsl(255, 70%, 50%)",
    "kebab": 89,
    "kebabColor": "hsl(219, 70%, 50%)",
    "fries": 26,
    "friesColor": "hsl(294, 70%, 50%)",
    "donut": 97,
    "donutColor": "hsl(261, 70%, 50%)",
    "junk": 28,
    "junkColor": "hsl(271, 70%, 50%)",
    "sushi": 56,
    "sushiColor": "hsl(239, 70%, 50%)",
    "ramen": 37,
    "ramenColor": "hsl(203, 70%, 50%)",
    "curry": 14,
    "curryColor": "hsl(11, 70%, 50%)",
    "udon": 64,
    "udonColor": "hsl(32, 70%, 50%)"
  },
  {
    "country": "AQ",
    "hot dog": 66,
    "hot dogColor": "hsl(128, 70%, 50%)",
    "burger": 33,
    "burgerColor": "hsl(85, 70%, 50%)",
    "sandwich": 65,
    "sandwichColor": "hsl(147, 70%, 50%)",
    "kebab": 25,
    "kebabColor": "hsl(250, 70%, 50%)",
    "fries": 90,
    "friesColor": "hsl(185, 70%, 50%)",
    "donut": 38,
    "donutColor": "hsl(36, 70%, 50%)",
    "junk": 1,
    "junkColor": "hsl(213, 70%, 50%)",
    "sushi": 61,
    "sushiColor": "hsl(223, 70%, 50%)",
    "ramen": 83,
    "ramenColor": "hsl(83, 70%, 50%)",
    "curry": 55,
    "curryColor": "hsl(79, 70%, 50%)",
    "udon": 2,
    "udonColor": "hsl(203, 70%, 50%)"
  }
];

const keys = [
  'hot dog',
  'burger',
  'sandwich',
  'kebab',
  'fries',
  'donut',
  'junk',
  'sushi',
  'ramen',
  'curry',
  'udon'
];

export default {
  name: "ScenarioMetricHeatmap",
  components: {
    'ResponsiveHeatmap': ResponsiveHeatmap
  },
  data() {
    return {
      data,
      keys
    }
  }
}
</script>

<style scoped>
.graph-container, .heatmap {
  height: 400px;
  width: 100%;
}
</style>