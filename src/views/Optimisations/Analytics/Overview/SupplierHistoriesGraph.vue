<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin/>
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale">
      <v-tooltip :shared="true"></v-tooltip>
      <v-interval
          position="supplier*value"
          opacity="1"
      >
      </v-interval>
      <v-axis
          dataKey="supplier"
      >
      </v-axis>
      <v-axis
          dataKey="value"
      >
      </v-axis>
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";
const _ = require('lodash');

export default {
  name: "SupplierHistoriesGraph",
  data() {
    return {
      isLoading: true,
      data: null,
      height: 500
    }
  },
  props: ['optimisationId'],
  computed: {
    graphData() {
      if (!this.data) {
        return [];
      }

      let sourceData = [];
      _.each(this.data, specData => {
        sourceData.push({
          'supplier': specData.supplier.name,
          'value': specData.order_count
        });
      });
      return sourceData.splice(0, 10);
    },
    scale() {
      return [{
        dataKey: 'supplier',
        type: 'cat',
        values: _.map(this.data, 'supplier.name'),
      }, {
        dataKey: 'value'
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
      axios.get(window.API_BASE + '/optimisations/' + this.optimisationId + '/supplier-analytics').then(r => {
        vm.isLoading = false;
        vm.data = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error loading supplier analytics');
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