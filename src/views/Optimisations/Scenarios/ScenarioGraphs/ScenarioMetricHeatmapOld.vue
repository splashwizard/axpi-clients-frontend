<template>
  <div class="graph-container" :key="updateKey">
    <v-chart :forceFit="true" :height="height" :data="graphData" :scale="scale">
      <!--      <v-legend/>-->
      <v-tooltip />
      <v-axis :tickLine="axis1Opts.tickLine" :grid="axis1Opts.grid" />
      <v-axis :tickLine="axis2Opts.tickLine" :grid="axis2Opts.grid" />
      <v-polygon
        :position="seriesOpts.position"
        :color="seriesOpts.color"
        :label="seriesOpts.label"
        :vStyle="seriesOpts.style"
      />
    </v-chart>

    <div class="metric-selector-wrapper">
      <a-select style="width: 100%" v-model="selectedMetricIds" mode="multiple" @change="incrementUpdateKey">
        <a-select-option v-for="(metric, i) in metricsAvailable" :key="i" :value="metric.id">
          {{ metric.label }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
const DataSet = require("@antv/data-set");
const _ = require("lodash");

const axis1Opts = {
  dataKey: "metric",
  tickLine: null,
  grid: {
    align: "center",
    lineStyle: {
      lineWidth: 1,
      lineDash: null,
      stroke: "#f0f0f0",
    },
  },
};

const axis2Opts = {
  dataKey: "scenario",
  title: null,
  grid: {
    align: "center",
    lineStyle: {
      lineWidth: 1,
      lineDash: null,
      stroke: "#f0f0f0",
    },
    showFirstLine: true,
  },
};

const seriesOpts = {
  quickType: "polygon",
  color: ["value", "#BAE7FF-#1890FF-#0050B3"],
  position: "metric*scenario",
  label: [
    "value",
    {
      offset: -2,
      textStyle: {
        fill: "#fff",
        shadowBlur: 2,
        shadowColor: "rgba(0, 0, 0, .45)",
      },
    },
  ],
  style: {
    lineWidth: 1,
    stroke: "#fff",
  },
};

export default {
  props: ["scenarios"],
  data() {
    return {
      height: 432,
      axis1Opts,
      axis2Opts,
      seriesOpts,

      metricsAvailable: [
        {
          id: "cost",
          label: "Cost",
        },
        {
          id: "co2e",
          label: "CO2e",
        },
        {
          id: "water",
          label: "Water",
        },
      ],

      selectedMetricIds: ["cost", "co2e"],

      updateKey: 1,
    };
  },

  methods: {
    incrementUpdateKey() {
      this.updateKey += 1;
    },
  },

  computed: {
    selectedMetrics() {
      return _.map(this.selectedMetricIds, (id) => {
        return _.find(this.metricsAvailable, { id: id });
      });
    },

    graphData() {
      const sourceData = [
        // {item: "Learn", count: 40},
        // {item: "Listen to Songs", count: 21},
        // {item: "work out", count: 17},
        // {item: "game", count: 13},
        // {item: "daze", count: 9}
        { scenario: "Best Price", metric: "cost", value: 20 },
        { scenario: "Best Price", metric: "co2e", value: 1 },
        { scenario: "Environmentally Friendly", metric: "cost", value: 15 },
        { scenario: "Environmentally Friendly", metric: "co2e", value: 30 },
      ];

      return sourceData;
    },

    scale() {
      return [
        {
          dataKey: "metric",
          type: "cat",
          values: _.map(this.selectedMetrics, "label"),
        },
        {
          dataKey: "scenario",
          type: "cat",
          values: _.map(this.scenarios, "name"),
        },
      ];
    },
  },
};
</script>

<style>
.metric-selector-wrapper {
  padding: 10px;
  padding-top: 0;
}
</style>
