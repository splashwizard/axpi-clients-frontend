<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin/>
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
      <v-tooltip :shared="true" :show-title="false"></v-tooltip>
      <v-interval
          position="specification*trueprice"
          opacity="1"
      >
      </v-interval>
      <v-axis :auto-rotate="true"
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
import Orders from "../../../../mixins/Orders";

export default {
  name: "WhatShouldBePayingForSpecificationGraph",
  props: ['optimisationId'],
  mixins: [Orders],
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
         'specification_full': specData.optimisation_specification.product_name,
         'specification': specData.optimisation_specification.product_name.substring(0, 15) + '...',
         // 'specification': specData.optimisation_specification.product_name,
         'trueprice': specData.trueprice
       });
     });
     // return sourceData;
     return _.sortBy(sourceData, 'trueprice');
   },
    scale() {
      return [{
        dataKey: 'specification',
        type: 'cat',
        // values: _.map(this.data, 'optimisation_specification.product_name'),
      }, {
        dataKey: 'trueprice',
        formatter: (val) => {
          return this.formatCost({cost: val, cost_currency: 'USD'})
        }
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