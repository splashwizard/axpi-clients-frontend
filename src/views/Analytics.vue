<template>
  <div class="analytics">

    <!-- Metrics top bar -->
    <a-row :gutter="15">
      <a-col :span="5" v-for="(m, index) in metricsTopBar" :key="index">
        <metric-card :index="index"
                     :background-colour="m.background"
                     :text-colour="m.text"
                     :metrics="metrics"
                     :selected-metric-id="m.metric_id"
                     :is-active="m.active"
                     @metric-changed="handleMetricChanged"
                     @toggle-active="toggleMetricActive"></metric-card>
      </a-col>
    </a-row>
    <!-- / Metrics top bar -->

    <!-- Tabs -->
    <div class="tabs-container">
      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="Time">
          <time-graph :key="updateKey" :chart-data="timeGraphData" :options="timeGraphOptions"
                      :styles="timeGraphStyles"></time-graph>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Location" force-render>
          Content of Tab Pane 2
        </a-tab-pane>
        <a-tab-pane key="3" tab="Organisational Unit">
          Content of Tab Pane 3
        </a-tab-pane>
        <a-tab-pane key="4" tab="Specifications">
          Content of Tab Pane 3
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- / Tabs -->

  </div>
</template>
<script>
import TimeGraph from "./Analytics/TimeGraph";

const _ = require('lodash');

export default {
  components: {TimeGraph},

  data() {
    return {
      metricsTopBar: [
        {
          metric_id: 'total-spend',
          background: '#3735b3',
          text: '#fff',
          active: true
        },
        {
          metric_id: 'average-order-value',
          background: '#4dc8f2',
          text: '#fff',
          active: false
        },
        {
          metric_id: 'average-order-value',
          background: '#46b98e',
          text: '#fff',
          active: false
        },
        {
          metric_id: 'average-order-value',
          background: '#fcb743',
          text: '#000',
          active: false
        }
      ],

      metrics: [
        {
          id: 'total-spend',
          label: 'Total Spend',
          value: '£1.4M',
          time_series_data: {
            'Apr 20': 1,
            'May 20': 2,
            'Jun 20': 3,
            'Jul 20': 4,
            'Aug 20': 5,
            'Sep 20': 6,
            'Oct 20': 7,
            'Nov 20': 8,
            'Dec 20': 9,
            'Jan 21': 10,
            'Feb 21': 11,
            'Mar 21': 12,
            'Apr 21': 13
          }
        },
        {
          id: 'average-order-value',
          label: 'AOV',
          value: '£30k',
          time_series_data: {
            'Apr 20': 3,
            'May 20': 2,
            'Jun 20': 1,
            'Jul 20': 2,
            'Aug 20': 3,
            'Sep 20': 2,
            'Oct 20': 1,
            'Nov 20': 2,
            'Dec 20': 3,
            'Jan 21': 2,
            'Feb 21': 1,
            'Mar 21': 2,
            'Apr 21': 1
          }
        },
        {
          id: 'average-items-per-order',
          label: 'Average Items / Order',
          value: 3,
          time_series_data: {
            'Apr 20': 9,
            'May 20': 8,
            'Jun 20': 8,
            'Jul 20': 5,
            'Aug 20': 4,
            'Sep 20': 3,
            'Oct 20': 2,
            'Nov 20': 1,
            'Dec 20': 0,
            'Jan 21': 0,
            'Feb 21': 0,
            'Mar 21': 0,
            'Apr 21': 0
          }
        }
      ],

      timeGraphStyles: {
        height: '300px',
        position: 'relative'
      },

      updateKey: 1
    }
  },

  computed: {
    timeGraphData() {
      const labels = ["Apr 20", "May 20", "Jun 20", "Jul 20", "Aug 20", "Sep 20", "Oct 20", "Nov 20", "Dec 20", "Jan 21", "Feb 21", "Mar 21", "Apr 21"];
      let datasets = [];

      const activeTopBarMetrics = _.filter(this.metricsTopBar, metric => {
        return metric.active === true;
      })

      _.each(activeTopBarMetrics, tbm => {
        let metric = _.find(this.metrics, {id: tbm.metric_id});
        datasets.push({
          label: metric.label,
          data: Object.values(metric.time_series_data),
          backgroundColor: 'rgba(0,0,0,0)',
          pointRadius: 3,
        });
      });

      return {
        labels: labels,
        datasets: datasets
      };
    },

    timeGraphOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {beginAtZero: true}
        }
      }
    }
  },

  methods: {
    toggleMetricActive(index) {
      let metric = this.metricsTopBar[index];
      metric.active = !metric.active;
      this.incrementUpdateKey();
    },

    handleMetricChanged(params) {
      const {index, metric_id} = params;
      let metric = this.metricsTopBar[index];
      metric.metric_id = metric_id;
      this.incrementUpdateKey();
    },

    incrementUpdateKey() {
      this.updateKey += 1;
    }
  }
}
</script>
<style>
.tabs-container {
  margin-top: 20px;
}
</style>