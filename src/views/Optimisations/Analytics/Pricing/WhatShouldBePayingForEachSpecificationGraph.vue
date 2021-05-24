<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin/>
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale">
      <v-tooltip :shared="true"></v-tooltip>
      <v-interval
          position="specification*trueprice"
          opacity="1"
      >
      </v-interval>
      <v-axis
          dataKey="specification"
      >
      </v-axis>
      <v-axis
          dataKey="trueprice"
      >
      </v-axis>
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";
const _ = require('lodash');

export default {
  name: "WhatShouldBePayingForSpecificationGraph",
  props: ['optimisationId'],
  data() {
    return {
      isLoading: true,
      data: null,
      height: 500
    }
  },
  computed: {
   graphData() {
    if (!this.data) {
      return [];
    }

     let sourceData = [];
     _.each(this.data, specData => {
       sourceData.push({
         'specification': specData.optimisation_specification.product_name,
         'trueprice': specData.trueprice
       });
     });
     return sourceData;
   },
    scale() {
      return [{
        dataKey: 'specification',
        type: 'cat',
        // values: _.map(this.data, 'optimisation_specification.product_name'),
      }, {
        dataKey: 'trueprice'
      }];
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/optimisations/' + this.optimisationId + '/price-analytics').then(r => {
        vm.isLoading = false;
        vm.data = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error loading price analytics');
      });
    }
  }
}
</script>

<style scoped>
.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}
</style>