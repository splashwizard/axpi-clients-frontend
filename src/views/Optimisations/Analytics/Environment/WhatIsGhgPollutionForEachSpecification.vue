<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin/>
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData">
      <v-tooltip/>
      <v-axis/>
      <v-legend/>
      <v-stack-bar position="specification*co2e" color="name"/>
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";

const _ = require('lodash');

export default {
  name: "WhatIsGhgPollutionForEachSpecification",
  props: ['optimisationId'],
  data() {
    return {
      isLoading: false,
      data: null,
      height: 500
    }
  },
  computed: {
    graphData() {
      let sourceData = [];
      _.each(this.data, envData => {
        if (envData.emissions.factory_co2e) {
          sourceData.push({
            specification: envData.specification,
            name: 'Factory',
            co2e: envData.emissions.factory_co2e
          });
        }
        if (envData.emissions.fuel_use_co2e) {
          sourceData.push({
            specification: envData.specification,
            name: 'Fuel Use',
            co2e: envData.emissions.fuel_use_co2e
          });
        }
        if (envData.emissions.chemicals_used_co2e) {
          sourceData.push({
            specification: envData.specification,
            name: 'Chemicals Used',
            co2e: envData.emissions.chemicals_used_co2e
          });
        }
        if (envData.emissions.vehicle_use_co2e) {
          sourceData.push({
            specification: envData.specification,
            name: 'Vehicle Use',
            co2e: envData.emissions.vehicle_use_co2e
          });
        }
      });
      return sourceData;
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/optimisations/' + this.optimisationId + '/environmental-analytics').then(r => {
        vm.data = r.data;
        console.log(r);
        vm.isLoading = false;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error loading GHG data');
      });
    }
  }
}
</script>

<style scoped>

</style>