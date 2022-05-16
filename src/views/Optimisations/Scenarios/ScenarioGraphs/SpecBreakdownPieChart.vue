<template>
  <div class="graph-container" :key="updateKey">
    <swooshy-selector v-model="metric" :options="metricOptions"></swooshy-selector>

    <v-chart :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
      <v-tooltip :showTitle="false" data-key="item*percent" />
      <v-axis />
      <v-legend data-key="item" />
      <v-pie position="percent" color="item" :vStyle="pieStyle" :label="labelConfig" />
      <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
    </v-chart>

    <div class="scenario-chooser-wrapper">
      <a-select style="width: 100%" v-model="selectedScenarioId" @change="incrementUpdateKey">
        <a-select-option v-for="(scenario, i) in scenarios" :key="i" :value="scenario.id">
          {{ scenario.name }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
const DataSet = require("@antv/data-set");
const _ = require("lodash");

const scale = [
  {
    dataKey: "percent",
    min: 0,
    formatter: ".0%",
  },
];

export default {
  name: "SpecBreakdownPieChart",
  props: ["scenarios"],
  data() {
    return {
      selectedScenarioId: null,

      metricOptions: [
        {
          value: "expected-cost",
          label: "Expected Cost",
        },
        {
          value: "co2e",
          label: "CO2e",
        },
      ],
      metric: { value: "co2e", label: "CO2e" },

      updateKey: 1,

      scale,
      height: 400,
      pieStyle: {
        stroke: "#fff",
        lineWidth: 1,
      },
      labelConfig: [
        // "percent",
        // {
        //   formatter: (val, item) => {
        //     return item.point.item + ": " + val;
        //   }
        // }
      ],
    };
  },
  mounted() {
    this.selectedScenarioId = _.first(this.scenarios) ? _.first(this.scenarios).id : null;
    this.incrementUpdateKey();
  },
  methods: {
    incrementUpdateKey() {
      this.updateKey += 1;
    },
  },
  computed: {
    selectedScenario() {
      return _.find(this.scenarios, { id: this.selectedScenarioId });
    },

    graphData() {
      // const sourceData = [
      //   {item: "Learn", count: 40},
      //   {item: "Listen to Songs", count: 21},
      //   {item: "work out", count: 17},
      //   {item: "game", count: 13},
      //   {item: "daze", count: 9}
      // ];

      let sourceData = [];

      _.each(this.selectedScenario.optimisation_scenario_specification_supplier_mappings, (mapping) => {
        if (this.metric.value === "expected-cost") {
          sourceData.push({
            item: mapping.optimisation_specification.product_name,
            count: mapping.expected_price,
          });
        }
        if (this.metric.value === "co2e") {
          sourceData.push({
            item: mapping.optimisation_specification.product_name,
            count: mapping.co2e,
            // count: mapping.co2e + Math.random() * 100
          });
        }
      });

      const dv = new DataSet.View().source(sourceData);
      dv.transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent",
      });
      return dv.rows;
    },
  },
};
</script>

<style>
.scenario-chooser-wrapper {
  padding: 10px;
  padding-top: 0;
}
</style>
