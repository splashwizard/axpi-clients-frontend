<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin/>
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale">
      <v-tooltip/>
      <v-axis :tickLine="axis1Opts.tickLine" :grid="axis1Opts.grid"/>
      <v-axis :tickLine="axis2Opts.tickLine" :grid="axis2Opts.grid"/>
      <v-polygon :position="seriesOpts.position" :color="seriesOpts.color" :label="seriesOpts.label"
                 :vStyle="seriesOpts.style"/>
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";
// const _ = require('lodash');

const axis1Opts = {
  dataKey: 'specification',
  tickLine: null,
  grid: {
    align: 'center',
    lineStyle: {
      lineWidth: 1,
      lineDash: null,
      stroke: '#f0f0f0',
    },
  },
};

const axis2Opts = {
  dataKey: 'supplier',
  title: null,
  grid: {
    align: 'center',
    lineStyle: {
      lineWidth: 1,
      lineDash: null,
      stroke: '#f0f0f0',
    },
    showFirstLine: true,
  },
};

const seriesOpts = {
  quickType: 'polygon',
  color: ['expected_price', '#BAE7FF-#1890FF-#0050B3'],
  position: 'specification*supplier',
  // label: ['expected_price', {
  //   offset: -2,
  //   textStyle: {
  //     fill: '#fff',
  //     shadowBlur: 2,
  //     shadowColor: 'rgba(0, 0, 0, .45)',
  //   },
  // }],
  style: {
    lineWidth: 1,
    stroke: '#fff',
  },
}

export default {
  name: "ExpectedPriceBySupplierForEachSpecificationGraph",
  props: ['optimisationId'],
  data() {
    return {
      isLoading: true,
      data: null,
      height: 500,
      axis1Opts,
      axis2Opts,
      seriesOpts
    }
  },
  computed: {
    graphData() {
      if (!this.data) {
        return [];
      }

      // let sourceData = [];
      // _.each(this.data, specData => {
      //   sourceData.push({
      //     'specification': specData.optimisation_specification.product_name,
      //     'trueprice': specData.trueprice
      //   });
      // });
      // return sourceData;
      return this.data;
    },
    scale() {
      return [{
        dataKey: 'supplier',
        type: 'cat',
        // values: _.map(this.data, 'supplier'),
      }, {
        dataKey: 'specification',
        type: 'cat',
        // values: _.map(this.data, 'specification'),
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
      axios.get(window.API_BASE + '/optimisations/' + this.optimisationId + '/supplier-spec-expected-prices').then(r => {
        vm.isLoading = false;
        vm.data = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error loading supplier spec expected prices');
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