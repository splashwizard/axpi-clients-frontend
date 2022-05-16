<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin />
    </div>
    <div v-if="!isLoading">
      <div class="supplier-selector">
        <a-select v-model="selectedSupplierName" style="width: 100%">
          <a-select-option v-for="(name, i) in suppliers" :key="i" :value="name">
            {{ name }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <v-chart v-if="!isLoading" :forceFit="true" :height="height" :data="graphData" renderer="svg" :scale="scale">
      <v-tooltip />
      <v-axis dataKey="specification" :title="{ text: 'Specification' }" />
      <v-axis dataKey="co2e" :title="{ text: 'CO2e' }" />
      <v-legend />
      <v-stack-bar position="specification*co2e" color="name" />
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

const _ = require("lodash");

const scale = [
  {
    dataKey: "co2e",
    formatter: (val) => {
      if (val === 0) {
        return 0;
      }
      return val + " kg";
    },
  },
];

export default {
  name: "WhatIsGhgPollutionForEachSpecification",
  props: ["optimisationId"],
  data() {
    return {
      isLoading: false,
      data: null,
      height: 428,
      scale,

      selectedSupplierName: _.first(this.suppliers),
    };
  },
  computed: {
    ...mapGetters("optimisationAnalyticsManager", {
      filterBySupplier: "filterBySupplier",
      filterBySpecification: "filterBySpecification",
      selectedSupplier: "selectedSupplier",
      selectedSpecification: "selectedSpecification",
    }),

    suppliers() {
      return _.uniq(_.map(this.data, "supplier"));
    },

    graphData() {
      let sourceData = [];
      _.each(this.data, (envData) => {
        if (envData.supplier === this.selectedSupplierName) {
          if (envData.emissions.factory_co2e) {
            sourceData.push({
              specification: envData.specification.substring(0, 7) + "...",
              name: "Factory",
              co2e: envData.emissions.factory_co2e,
            });
          }
          if (envData.emissions.fuel_use_co2e) {
            sourceData.push({
              specification: envData.specification.substring(0, 7) + "...",
              name: "Fuel Use",
              co2e: envData.emissions.fuel_use_co2e,
            });
          }
          if (envData.emissions.chemicals_used_co2e) {
            sourceData.push({
              specification: envData.specification.substring(0, 7) + "...",
              name: "Chemicals Used",
              co2e: envData.emissions.chemicals_used_co2e,
            });
          }
          if (envData.emissions.vehicle_use_co2e) {
            sourceData.push({
              specification: envData.specification.substring(0, 7) + "...",
              name: "Vehicle Use",
              co2e: envData.emissions.vehicle_use_co2e,
            });
          }
        }
      });
      return _.sortBy(sourceData, "co2e");
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

      if (this.filterBySpecification && this.selectedSpecification) {
        params["optimisation_specification_id"] = this.selectedSpecification.id;
      }

      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisationId + "/environmental-analytics", params)
        .then((r) => {
          vm.data = r.data;
          vm.selectedSupplierName = _.first(this.suppliers);
          console.log(r);
          vm.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading GHG data");
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
.supplier-selector {
  padding: 20px;
}

.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}
</style>
