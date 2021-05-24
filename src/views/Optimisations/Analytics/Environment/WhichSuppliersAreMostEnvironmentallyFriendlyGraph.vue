<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin/>
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale">
      <v-tooltip :showTitle="false" />
      <v-axis dataKey="total_co2e" />
      <v-legend dataKey="Specification"
                :slidable="false"
                :show="true" />
      <v-point
          position="total_co2e*water"
          :color="pointColor"
          :size="pointSize"
          :vStyle="pointStyle"
          tooltip="specification*supplier*total_co2e*water"
          shape="circle"
      />
    </v-chart>
  </div>
</template>

<script>
import { Global } from 'viser-vue';
import axios from "axios";

const scale = [{
  dataKey: 'total_co2e',
  alias: 'CO2e'
}, {
  dataKey: 'water',
  alias: 'Water'
}, {
  dataKey: 'supplier',
  alias: 'Supplier'
}, {
  dataKey: 'specification',
  alias: 'Specification'
}];


export default {
  name: "WhichSuppliersAreMostEnvironmentallyFriendly",
  props: ['optimisationId'],
  data() {
    return {
      isLoading: false,
      data: null,

      height: 500,
      scale,

      pointColor: ['specification', val => this.colorMap[val]],
      pointSize: ['expected_price', [4, 40]],
      pointStyle: ['continent', {
        lineWidth: 1,
        strokeOpacity: 1,
        fillOpacity: 0.3,
        opacity: 0.65,
        stroke: val => this.colorMap[val],
      }],
    }
  },
  computed: {
    colorMap() {
      return {
        'Asia': Global.colors[0],
        'Americas': Global.colors[1],
        'Europe': Global.colors[2],
        'Oceania': Global.colors[3],
      };
    },
    graphData() {
      return this.data;
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/optimisations/' + this.optimisationId + '/environmental-analytics?include_pricing_data=1').then(r => {
        vm.isLoading = false;
        vm.data = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error loading environmental analytics');
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