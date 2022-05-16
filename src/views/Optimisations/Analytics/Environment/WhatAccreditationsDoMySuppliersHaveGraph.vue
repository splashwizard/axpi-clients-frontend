<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin />
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
      <!--      <v-legend/>-->
      <v-tooltip />
      <v-axis :title="{ text: 'Accreditation' }" :tickLine="axis1Opts.tickLine" :grid="axis1Opts.grid" />
      <v-axis :title="{ text: 'Supplier' }" :tickLine="axis2Opts.tickLine" :grid="axis2Opts.grid" />
      <v-polygon
        :position="seriesOpts.position"
        :color="seriesOpts.color"
        :label="seriesOpts.label"
        :vStyle="seriesOpts.style"
      />
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

const _ = require("lodash");

const axis1Opts = {
  dataKey: "accreditation",
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
  dataKey: "supplier",
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
  // color: ['value', '#E60000-#000000-#4CBB17'],
  color: ["value", "#BAE7FF-#1890FF-#0050B3"],
  position: "accreditation*supplier",
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
  name: "WhatAccreditationsDoMySuppliersHaveGraph",
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
      selectedSupplier: "selectedSupplier",
    }),

    accreditations() {
      if (this.data) {
        return this.data.accreditations;
      }
      return [];
    },

    suppliers() {
      if (this.data) {
        return this.data.suppliers;
      }
      return [];
    },

    graphData() {
      let sourceData = [];
      _.each(this.accreditations, (accreditation) => {
        _.each(this.suppliers, (supplier) => {
          let idsOfAccreditationsSupplierHas = _.map(supplier.accreditations, "id");
          let doesSupplierHaveAccreditation = idsOfAccreditationsSupplierHas.includes(accreditation.id);
          sourceData.push({
            accreditation: accreditation.name,
            supplier: supplier.name.substring(0, 6) + "...",
            value: doesSupplierHaveAccreditation ? 1 : 0,
          });
        });
      });
      return sourceData;
    },

    scale() {
      return [
        {
          dataKey: "supplier",
          type: "cat",
          // values: _.map(this.suppliers, 'name'),
        },
        {
          dataKey: "accreditation",
          type: "cat",
          // values: _.map(this.accreditations, 'name'),
        },
      ];
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;

      let params = {};
      if (this.filterBySupplier && this.selectedSupplier) {
        params["supplier_id"] = this.selectedSupplier.id;
      }

      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/suppliers/accreditations", params)
        .then((r) => {
          vm.isLoading = false;
          vm.data = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading supplier accreditations");
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
