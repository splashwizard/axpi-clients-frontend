<template>
  <div class="analytics">

    <a-row :gutter="15">
      <a-col :span="5" v-for="(m, key) in metricsTopBar" :key="key">
        <metric :id="key"
                :background-colour="m.background"
                :text-colour="m.text"
                :metrics="metrics"
                :initial="m.metric_id"
                :is-active="isMetricActive(key)"
                @toggle-active="toggleMetricActive"></metric>
      </a-col>
    </a-row>

  </div>
</template>
<script>
let _ = require('lodash');

export default {
  data() {
    return {
      metricsTopBar: [
        {
          metric_id: 'total-spend',
          background: '#3735b3',
          text: '#fff'
        },
        {
          metric_id: 'average-order-value',
          background: '#4dc8f2',
          text: '#fff'
        },
        {
          metric_id: 'average-order-value',
          background: '#46b98e',
          text: '#fff'
        },
        {
          metric_id: 'average-order-value',
          background: '#fcb743',
          text: '#000'
        }
      ],
      activeMetrics: [0],

      metrics: [
        {
          id: 'total-spend',
          label: 'Total Spend',
          value: '£1.4M'
        },
        {
          id: 'average-order-value',
          label: 'AOV',
          value: '£30k'
        },
        {
          id: 'average-items-per-order',
          label: 'Average Items / Order',
          value: 3
        }
      ]
    }
  },

  methods: {
    isMetricActive(id) {
      return this.activeMetrics.includes(id);
    },

    toggleMetricActive(id) {
      this.activeMetrics = _.xor(this.activeMetrics, [id]);
    }
  }
}
</script>