<template>
  <div class="graph-container">
    <div class="toolbar">
      <div class="toolbar-col">
        <a-select v-model="metric">
          <a-select-option :value="option.value"
                           v-for="(option, i) in metricOptions" :key="i">
            {{ option.label }}
          </a-select-option>
        </a-select>
      </div>
      <div class="toolbar-col">
        <a-range-picker v-model="dateRange"/>
      </div>
    </div>

    <div v-if="isLoading" class="loading-screen">
      <a-spin/>
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
      <v-tooltip :shared="true"></v-tooltip>
      <v-interval
          position="supplier*value"
          opacity="1"
      >
      </v-interval>
      <v-axis
          dataKey="supplier"
          :title="{'text': 'Supplier'}"
      >
      </v-axis>
      <v-axis
          dataKey="value"
          :title="{'text': selectedMetric.label}"
      >
      </v-axis>
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../../../mixins/Orders";
import {mapGetters} from "vuex";

const _ = require('lodash');

const METRIC_OPTIONS = [
  {
    label: 'Number of past orders',
    value: 'order_count'
  },
  {
    label: 'Total spend',
    value: 'total_spend'
  }
];

export default {
  name: "SupplierHistoriesGraph",
  mixins: [Orders],
  data() {
    return {
      isLoading: true,
      data: null,
      height: 500,
      metric: 'order_count',
      metricOptions: METRIC_OPTIONS,
      dateRange: null
    }
  },
  props: ['optimisationId'],
  computed: {
    ...mapGetters('optimisationAnalyticsManager', {
      filterBySupplier: 'filterBySupplier',
      selectedSupplier: 'selectedSupplier',
    }),

    selectedMetric() {
      return _.find(this.metricOptions, {
        value: this.metric
      });
    },
    graphData() {
      if (!this.data) {
        return [];
      }

      let sourceData = [];
      _.each(this.data, specData => {
        let params = {
          'supplier': specData.supplier.name.substring(0, 5) + '...',
          'value': specData[this.metric]
        };
        sourceData.push(params);
      });
      sourceData = _.uniqBy(sourceData, 'supplier');
      return _.sortBy(sourceData, 'value');
    },
    scale() {
      return [{
        dataKey: 'supplier',
        type: 'cat',
        // values: _.map(this.data, 'supplier.name'),
      }, {
        dataKey: 'value',
        formatter: (val) => {
          if (this.metric == 'total_spend') {
            return this.formatCost({cost: val, cost_currency: 'USD'})
          }
          return val;
        }
      }];
    }
  },
  created() {
    this.fetch();
  },
  watch: {
    dateRange() {
      this.fetch();
    },
    filterBySupplier() {
      this.fetch();
    },
    selectedSupplier() {
      this.fetch();
    }
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;

      let params = {};

      if (this.dateRange && this.dateRange.length === 2) {
        params['start_date'] = window.moment(this.dateRange[0]).format('YYYY-MM-DD');
        params['end_date'] = window.moment(this.dateRange[1]).format('YYYY-MM-DD');
      }

      if (this.filterBySupplier && this.selectedSupplier) {
        params['supplier_id'] = this.selectedSupplier.id;
      }

      axios.post(window.API_BASE + '/optimisations/' + this.optimisationId + '/supplier-analytics', params).then(r => {
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

.toolbar {
  display: flex;
  flex-direction: row;
}

.toolbar .ant-select {
  width: 100%;
}

.toolbar .toolbar-col {
  flex: 1;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 10px;
}
</style>