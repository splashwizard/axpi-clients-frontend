<template>
  <div class="analytics">

    <div class="page-header">
      <h1 class="page-title">Analytics</h1>
      <div class="actions">
        <a-button type="primary" icon="eye" @click="openViewChanger"></a-button>
        <a-drawer
            title="Views"
            placement="right"
            :visible="viewChangerVisible"
            @close="closeViewChanger"
        >

          <!-- Inside -->
          <div class="view-changer-inside">
            <div class="top-section">
              <a-button :class="{'active': selectedViewId === view.id}"
                        @click.prevent="selectView(view.id)"
                        block v-for="view in views"
                        :key="view.id">{{ view.name }}
              </a-button>
            </div>
            <div class="bottom-section">
              <a-button @click.prevent="() => addView()"
                        block type="primary" icon="plus">Add View
              </a-button>
            </div>
          </div>
          <!-- / Inside -->

        </a-drawer>
      </div>
    </div>

    <!-- Wrapper -->
    <div class="wrapper" v-if="selectedView">
      <!-- Metrics top bar -->
      <div class="metrics-top-bar">
        <div v-for="(m, index) in selectedView.metricsTopBar" :key="index">
          <metric-card :index="index"
                       :background-colour="m.background"
                       :text-colour="m.text"
                       :metrics="metrics"
                       :selected-metric-id="m.metric_id"
                       :is-active="m.active"
                       @metric-changed="handleMetricChanged"
                       @toggle-active="toggleMetricActive"></metric-card>
        </div>
      </div>
      <!-- / Metrics top bar -->

      <!-- Tabs 1 -->
      <div class="tabs-container">
        <a-tabs default-active-key="1" :animated="false">
          <a-tab-pane key="1" tab="Time">
            <!-- Time toolbar -->
            <time-toolbar class="time-toolbar" :time-options="timeOptions"></time-toolbar>
            <!-- Time toolbar -->

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
      <!-- / Tabs 1 -->

      <!-- Tabs 2 -->
      <div class="tabs-2-container">
        <a-tabs default-active-key="1" :animated="false">
          <a-tab-pane key="1" tab="Orders">
          </a-tab-pane>
          <a-tab-pane key="2" tab="Information">
          </a-tab-pane>
          <a-tab-pane key="3" tab="Suppliers">
          </a-tab-pane>
          <a-tab-pane key="4" tab="Pricing">
          </a-tab-pane>
          <a-tab-pane key="5" tab="Environments">
          </a-tab-pane>
        </a-tabs>
      </div>
      <!-- / Tabs 2 -->
    </div>
    <!-- / Wrapper -->

  </div>
</template>
<script>
import TimeGraph from "./Analytics/TimeGraph";
import TimeToolbar from "./Analytics/TimeToolbar";

const _ = require('lodash');
const moment = require('moment');
import {v4 as uuidv4} from 'uuid';

const VIEW_TEMPLATE = {
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
      background: '#ebdf00',
      text: '#000',
      active: false
    },
    {
      metric_id: 'average-order-value',
      background: '#fcb743',
      text: '#000',
      active: false
    }
  ]
};


export default {
  components: {TimeGraph, TimeToolbar},

  data() {
    return {
      views: [],
      viewChangerVisible: false,

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
        marginTop: '25px',
        height: '350px',
        position: 'relative'
      },

      timeOptions: {
        duration: '1Y'
      },

      updateKey: 1,
      selectedViewId: null
    }
  },

  computed: {
    timeGraphData() {
      const labels = ["Apr 20", "May 20", "Jun 20", "Jul 20", "Aug 20", "Sep 20", "Oct 20", "Nov 20", "Dec 20", "Jan 21", "Feb 21", "Mar 21", "Apr 21"];
      let datasets = [];

      const activeTopBarMetrics = _.filter(this.selectedView.metricsTopBar, metric => {
        return metric.active === true;
      })

      _.each(activeTopBarMetrics, tbm => {
        let metric = _.find(this.metrics, {id: tbm.metric_id});
        datasets.push({
          label: metric.label,
          data: Object.values(metric.time_series_data),
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: tbm.background,
          pointBackgroundColor: tbm.background,
          pointRadius: 2,
          borderWidth: 2
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
          y: {beginAtZero: true},
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        }
      }
    },

    selectedView() {
      return _.find(this.views, {
        id: this.selectedViewId
      });
    }
  },

  mounted() {
    this.addView('Default');
  },

  methods: {
    generateViewId() {
      return uuidv4();
    },

    selectView(viewId) {
      this.selectedViewId = viewId;
      this.viewChangerVisible = false;
    },

    addView(name = null) {
      const viewId = this.generateViewId();
      this.views.push(
          {
            id: viewId,
            name: name ? name : moment().format('DD/MM/YYYY HH:mm'),
            ..._.cloneDeep(VIEW_TEMPLATE)
          }
      );
      this.selectView(viewId);
    },

    toggleMetricActive(index) {
      let metric = this.selectedView.metricsTopBar[index];
      metric.active = !metric.active;
      this.incrementUpdateKey();
    },

    handleMetricChanged(params) {
      const {index, metric_id} = params;

      let metric = this.selectedView.metricsTopBar[index];
      metric.metric_id = metric_id;
      this.incrementUpdateKey();
    },

    incrementUpdateKey() {
      this.updateKey += 1;
    },

    openViewChanger() {
      this.viewChangerVisible = true;
    },

    closeViewChanger() {
      this.viewChangerVisible = false;
    }
  }
}
</script>
<style>
.tabs-container {
  margin-top: 20px;
}

.tabs-2-container {
  margin-top: 30px;
}

.metrics-top-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.metrics-top-bar > div {
  flex: 1;
  max-width: 19%;
}

.time-toolbar {
  margin-top: 10px;
}

.ant-drawer-wrapper-body {
  display: flex;
  flex-direction: column;
}

.ant-drawer-body {
  flex: 1;
}

.view-changer-inside {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.view-changer-inside .top-section {
  flex: 1;
}

.view-changer-inside .top-section .ant-btn {
  margin-bottom: 10px;
}

.view-changer-inside .bottom-section {
  flex-shrink: 1;
}
</style>