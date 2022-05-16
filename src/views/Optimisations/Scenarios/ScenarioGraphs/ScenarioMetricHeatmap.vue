<template>
  <div class="graph-container scenario-metric-heatmap" :key="updateKey">
    <v-chart :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
      <!--      <v-legend/>-->
      <v-tooltip :htmlContent="htmlContent" />
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
// const DataSet = require("@antv/data-set");
import Orders from "../../../../mixins/Orders";
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
  // position: 'metric*scenario',
  position: "scenario*metric",
  // label: ['value', {
  //   offset: -2,
  //   textStyle: {
  //     fill: '#fff',
  //     shadowBlur: 2,
  //     shadowColor: 'rgba(0, 0, 0, .45)',
  //   },
  // }],
  style: {
    lineWidth: 1,
    stroke: "#fff",
  },
};

export default {
  props: ["scenarios"],
  mixins: [Orders],
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

    htmlContent(title, items) {
      var html = '<div class="g2-tooltip">';
      var titleDom = '<div class="g2-tooltip-title" style="margin-bottom: 4px;">' + title + "</div>";
      var listDom = '<ul class="g2-tooltip-list">';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        let value = item.point._origin.unnormalized;
        if (item.point._origin.metricLabel === "co2e") {
          value = value + " kg";
        } else {
          value = this.formatCost({
            cost: value / 100,
            cost_currency: "USD",
          });
        }
        var itemDom =
          "<li data-index={index}>" +
          '<span style="background-color:' +
          item.color +
          ';width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
          item.name +
          '<span class="g2-tooltip-value">' +
          value +
          "</span>" +
          "</li>";
        listDom += itemDom;
      }
      listDom += "</ul>";
      return html + titleDom + listDom + "</div>";
    },
  },

  computed: {
    selectedMetrics() {
      return _.map(this.selectedMetricIds, (id) => {
        return _.find(this.metricsAvailable, { id: id });
      });
    },

    sourceData() {
      let sourceData = [];

      let maxCost = _.max(_.map(this.scenarios, "expected_cost"));
      let maxCo2e = _.max(_.map(this.scenarios, "co2e"));

      _.each(this.scenarios, (scenario) => {
        if (this.selectedMetricIds.includes("cost")) {
          sourceData.push({
            scenario: scenario.name,
            metric: "cost",
            value: scenario.expected_cost / maxCost,
            unnormalized: scenario.expected_cost,
          });
        }

        if (this.selectedMetricIds.includes("co2e")) {
          sourceData.push({
            scenario: scenario.name,
            metric: "co2e",
            value: scenario.co2e / maxCo2e,
            unnormalized: scenario.co2e,
          });
        }
      });

      return sourceData;
    },

    graphData() {
      // let sourceData = [
      //   // {item: "Learn", count: 40},
      //   // {item: "Listen to Songs", count: 21},
      //   // {item: "work out", count: 17},
      //   // {item: "game", count: 13},
      //   // {item: "daze", count: 9}
      //   {scenario: "Best Price", metric: "cost", value: 20},
      //   {scenario: "Best Price", metric: "co2e", value: 1},
      //   {scenario: "Environmentally Friendly", metric: "cost", value: 15},
      //   {scenario: "Environmentally Friendly", metric: "co2e", value: 30}
      // ];

      return _.map(this.sourceData, (data) => {
        let scenario = _.find(this.scenarios, { name: data.scenario });
        let scenarioIndex = this.scenarios.indexOf(scenario);
        let metricIndex = this.selectedMetricIds.indexOf(data.metric);

        return {
          scenario: scenarioIndex,
          metric: metricIndex,
          scenarioLabel: data.scenario,
          metricLabel: data.metric,
          value: data.value,
          unnormalized: data.unnormalized,
        };
      });
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

<style lang="scss">
.metric-selector-wrapper {
  padding: 10px;
  padding-top: 0;
}

.scenario-metric-heatmap {
  .g2-tooltip {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 3px;
    color: rgb(87, 87, 87);
    font-size: 12px;
    line-height: 20px;
    padding: 10px 10px 6px 10px;
  }

  .g2-tooltip-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .g2-tooltip-value {
    margin-left: 30px;
    display: inline;
    float: right;
  }

  .g2-tooltip-statistic {
    font-size: 14px;
    padding-bottom: 10px;
    margin-top: 10px;
    list-style-type: none;
  }

  .g2-tooltip-statistic-value {
    font-weight: "bold";
    display: "inline-block";
    float: right;
    margin-left: 30px;
  }
}
</style>
