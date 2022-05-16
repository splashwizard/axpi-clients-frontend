<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin />
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
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
  </div>
</template>
>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
const _ = require("lodash");

const axis1Opts = {
  dataKey: "supplier",
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
  dataKey: "specification",
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
  position: "supplier*specification",
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
  name: "WhatEnvironmentalInformationCompleteForEachSpecification",
  props: ["optimisationId"],
  data() {
    return {
      isLoading: false,
      data: null,

      height: 500,
      axis1Opts,
      axis2Opts,
      seriesOpts,
    };
  },
  computed: {
    ...mapGetters("optimisationAnalyticsManager", {
      filterBySupplier: "filterBySupplier",
      filterBySpecification: "filterBySpecification",
      selectedSupplier: "selectedSupplier",
      selectedSpecification: "selectedSpecification",
    }),
    // specifications() {
    //   if (this.data) {
    //     return _.map(this.data, 'specification');
    //   }
    //   return [];
    // },
    // suppliers() {
    //   if (this.data) {
    //     return _.map(this.data, 'supplier');
    //   }
    //   return [];
    // },
    graphData() {
      let sourceData = [];
      _.each(this.data, (envData) => {
        sourceData.push({
          specification: envData.specification.substring(0, 8) + "...",
          supplier: envData.supplier,
          value: Math.round((envData.completeness.completed / envData.completeness.total) * 100),
        });
      });
      return sourceData;
    },
    scale() {
      return [
        {
          dataKey: "specification",
          type: "cat",
          // values: this.specifications,
        },
        {
          dataKey: "supplier",
          type: "cat",
          // values: this.suppliers
        },
      ];
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    incrementUpdateKey() {
      this.updateKey += 1;
    },

    fetch() {
      let vm = this;

      let params = {};

      if (this.filterBySupplier && this.selectedSupplier) {
        params["supplier_id"] = this.selectedSupplier.id;
      }

      if (this.filterBySpecification && this.selectedSpecification) {
        params["optimisation_specification_id"] = this.selectedSpecification.id;
      }

      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisationId + "/environmental-analytics", params)
        .then((r) => {
          vm.data = r.data;
          console.log(r);
          vm.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading environmental breakdown");
        });
    },
  },
  watch: {
    filterBySupplier() {
      this.fetch();
    },
    selectedSupplier() {
      this.fetch();
    },
    filterBySpecification() {
      this.fetch();
    },
    selectedSpecification() {
      this.fetch();
    },
  },
};
</script>

<style scoped>
.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}
</style>
