<template>
  <div class="analytics">

    <div class="page-header">
      <h1 class="page-title">Analytics</h1>
      <div class="actions">
        <a-button type="secondary" class="button-header" size="large" shape="circle"
                  icon="share-alt" @click="openShareTab"></a-button>
        <a-drawer title="Share this report" placement="right" width="350" :visible="shareTabVisible"
                  @close="closeShareTab"
                  @click="openShareTab">
          <a-button block size="large" icon="link" class="share-button button-margin-bottom">
            <div class="share-button-inner">
              <div class="share-button-text">
                Share link
              </div>
              <a-icon type="right"></a-icon>
            </div>
          </a-button>
          <a-button block size="large" icon="file" class="share-button button-margin-bottom">
            <div class="share-button-inner">
              <div class="share-button-text">
                Download file
              </div>
              <a-icon type="right"></a-icon>
            </div>
          </a-button>
        </a-drawer>

        <a-button type="secondary" class="button-header" size="large" shape="circle"
                  icon="bulb" @click="openInsightsTab"></a-button>
        <a-drawer title="Insights" placement="right" width="400"
                  :visible="insightsTabVisible" @close="closeInsightsTab">

          <a-collapse class="collapse-margin-bottom">
            <a-collapse-panel key="1" header="Basic Performance">
              <p></p>
            </a-collapse-panel>
          </a-collapse>

          <a-collapse class="collapse-margin-bottom">
            <a-collapse-panel key="1" header="Price Performance">
            </a-collapse-panel>
          </a-collapse>

          <a-collapse class="collapse-margin-bottom">
            <a-collapse-panel key="1" header="Diversity">
            </a-collapse-panel>
          </a-collapse>

          <a-collapse class="collapse-margin-bottom">
            <a-collapse-panel key="1" header="Suppliers">
            </a-collapse-panel>
          </a-collapse>

          <a-collapse class="collapse-margin-bottom">
            <a-collapse-panel key="1" header="Orders">
            </a-collapse-panel>
          </a-collapse>

          <a-collapse class="collapse-margin-bottom">
            <a-collapse-panel key="1" header="Information">
            </a-collapse-panel>
          </a-collapse>

          <a-collapse>
            <a-collapse-panel key="1" header="Environmentalism">
              <a-button @click.prevent="getInsight">Which is my most environmentally harmful specification this month?
              </a-button>
              <a-button @click.prevent="getInsight">Which business unit is the least environmentally friendly?
              </a-button>
              <a-button @click.prevent="getInsight">Which country produces the most CO2e?</a-button>
              <a-button @click.prevent="getInsight">What should I do to reduce my environmental impact in my print
                category?
              </a-button>
              <a-button @click.prevent="getInsight">What is my environmental impact by not using recycled materials?
              </a-button>
            </a-collapse-panel>
          </a-collapse>

          <!-- RESULTS DRAWER -->
          <a-drawer class="insight-results-drawer" title="Results" :visible="insightResultsTabVisible" width="350"
                    @close="closeInsightResultsTab">

            <div class="insight-results-question">
              <b>You asked: which business unit is the most environmentally friendly?</b>
            </div>

            <a-card>
              <p>
                Business unit 1 is the most environmentally friendly.
              </p>
              <p>
                It's carbon emissions are 20% below your organisational average.
              </p>
            </a-card>

          </a-drawer>
          <!-- / RESULTS DRAWER -->

        </a-drawer>

        <a-button type="secondary" class="button-header" size="large" shape="circle"
                  icon="eye" @click="openViewChanger"></a-button>
        <a-drawer
            title="Views"
            placement="right"
            :visible="viewChangerVisible"
            @close="closeViewChanger"
        >

          <!-- Inside -->
          <div class="view-changer-inside">
            <div class="top-section">

              <!-- View -->
              <div class="view-selector" v-for="view in views" :key="view.id">

                <a-card :bordered="false" @click.prevent="selectView(view.id)">
                  <img slot="cover" :class="{'selected': selectedViewId === view.id}"
                       src="/img/analytics/screenshot.png" alt="Analytics">
                  <a-card-meta :title="view.name">
                  </a-card-meta>
                </a-card>

                <!--                <a-button :class="{'active': selectedViewId === view.id}"-->
                <!--                          -->
                <!--                          block>{{ view.name }}-->
                <!--                </a-button>-->
              </div>
              <!-- / View -->

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
                       :start-month="startMonth"
                       :end-month="endMonth"
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
            <location-graph :key="updateKey"></location-graph>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Organisational Unit">
            <organisational-graph></organisational-graph>
          </a-tab-pane>
          <a-tab-pane key="4" tab="Specifications">
            <analytics-specifications-table></analytics-specifications-table>
          </a-tab-pane>
        </a-tabs>
      </div>
      <!-- / Tabs 1 -->

      <!-- Tabs 2 -->
      <div class="tabs-2-container">
        <a-tabs default-active-key="1" :animated="false">
          <a-tab-pane key="1" tab="Environment">
            <environment-tab></environment-tab>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Orders">
          </a-tab-pane>
          <a-tab-pane key="3" tab="Information">
          </a-tab-pane>
          <a-tab-pane key="4" tab="Suppliers">
          </a-tab-pane>
          <a-tab-pane key="5" tab="Pricing">
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
import EnvironmentTab from "./Analytics/EnvironmentTab";

const _ = require('lodash');
const moment = require('moment');
import {v4 as uuidv4} from 'uuid';
import OrganisationalGraph from "./Analytics/OrganisationalGraph";
import LocationGraph from "./Analytics/LocationGraph";
import AnalyticsSpecificationsTable from "./Analytics/AnalyticsSpecificationsTable";

const VIEW_TEMPLATE = {
  metricsTopBar: [
    {
      metric_id: 'total-spend',
      background: '#3735b3',
      text: '#fff',
      active: true
    },
    {
      metric_id: 'co2e',
      background: '#4dc8f2',
      text: '#fff',
      active: false
    },
    {
      metric_id: 'water',
      background: '#46b98e',
      text: '#fff',
      active: false
    },
    {
      metric_id: 'savings',
      background: '#ebdf00',
      text: '#000',
      active: false
    },
    {
      metric_id: 'orders',
      background: '#fcb743',
      text: '#000',
      active: false
    }
  ]
};


export default {
  components: {
    LocationGraph,
    TimeGraph,
    TimeToolbar,
    OrganisationalGraph,
    EnvironmentTab,
    AnalyticsSpecificationsTable
  },

  data() {
    return {
      views: [],
      viewChangerVisible: false,
      insightsTabVisible: false,
      insightResultsTabVisible: false,
      shareTabVisible: false,
      startMonth: 3,
      endMonth: 16,

      metrics: [
        {
          id: 'total-spend',
          label: 'Total Spend',
          // value: '£1.4M',
          value: function(startMonth, endMonth, timeSeriesData) {
            // return startMonth + endMonth;
            let sum = _.sum(Object.values(timeSeriesData).splice(startMonth, endMonth));
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(sum);
          },
          time_series_data: {
            'Jan 2020': 2282860,
            'Feb 2020': 1343124,
            'Mar 2020': 2476040,
            'Apr 2020': 1243835,
            'May 2020': 2647940,
            'Jun 2020': 1950403,
            'Jul 2020': 1106609,
            'Aug 2020': 1754552,
            'Sep 2020': 3023468,
            'Oct 2020': 1729170,
            'Nov 2020': 813515,
            'Dec 2020': 2273012,
            'Jan 2021': 1101033,
            'Feb 2021': 1345824,
            'Mar 2021': 3520224,
            'Apr 2021': 2548798,
            'May 2021': 3468080,
            'Jun 2021': 2153280
          }
        },
        {
          id: 'co2e',
          label: 'CO2e',
          // value: '1',
          value: function(startMonth, endMonth, timeSeriesData) {
            // return startMonth + endMonth;
            let sum = _.sum(Object.values(timeSeriesData).splice(startMonth, endMonth));
            return sum + ' kg';
          },
          time_series_data: {
            'Jan 2020': 63,
            'Feb 2020': 94,
            'Mar 2020': 140,
            'Apr 2020': 117,
            'May 2020': 62,
            'Jun 2020': 84,
            'Jul 2020': 51,
            'Aug 2020': 134,
            'Sep 2020': 100,
            'Oct 2020': 114,
            'Nov 2020': 92,
            'Dec 2020': 117,
            'Jan 2021': 85,
            'Feb 2021': 77,
            'Mar 2021': 141,
            'Apr 2021': 131,
            'May 2021': 91,
            'Jun 2021': 119
          }
        },
        {
          id: 'water',
          label: 'Water',
          // value: '1',
          value: function(startMonth, endMonth, timeSeriesData) {
            // return startMonth + endMonth;
            let sum = _.sum(Object.values(timeSeriesData).splice(startMonth, endMonth));
            return sum + ' T';
          },
          time_series_data: {
            'Jan 2020': 730,
            'Feb 2020': 685,
            'Mar 2020': 606,
            'Apr 2020': 910,
            'May 2020': 910,
            'Jun 2020': 392,
            'Jul 2020': 592,
            'Aug 2020': 1015,
            'Sep 2020': 581,
            'Oct 2020': 665,
            'Nov 2020': 602,
            'Dec 2020': 316,
            'Jan 2021': 560,
            'Feb 2021': 370,
            'Mar 2021': 654,
            'Apr 2021': 452,
            'May 2021': 440,
            'Jun 2021': 700
          }
        },
        {
          id: 'savings',
          label: 'Savings',
          // value: '1',
          value: function(startMonth, endMonth, timeSeriesData) {
            // return startMonth + endMonth;
            let sum = _.sum(Object.values(timeSeriesData).splice(startMonth, endMonth));
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(sum);
          },
          time_series_data: {
            'Jan 2020': 307304,
            'Feb 2020': 331296,
            'Mar 2020': 452668,
            'Apr 2020': 202533,
            'May 2020': 488522,
            'Jun 2020': 149113,
            'Jul 2020': 129732,
            'Aug 2020': 487129,
            'Sep 2020': 369323,
            'Oct 2020': 197640,
            'Nov 2020': 238145,
            'Dec 2020': 363039,
            'Jan 2021': 308252,
            'Feb 2021': 398058,
            'Mar 2021': 240899,
            'Apr 2021': 262354,
            'May 2021': 484095,
            'Jun 2021': 364543
          }
        },
        {
          id: 'total-spend',
          label: 'Total Spend',
          // value: '1',
          value: function(startMonth, endMonth, timeSeriesData) {
            // return startMonth + endMonth;
            let sum = _.sum(Object.values(timeSeriesData).splice(startMonth, endMonth));
            return sum;
          },
          time_series_data: {
            'Jan 2020': 2389170,
            'Feb 2020': 2631537,
            'Mar 2020': 4053830,
            'Apr 2020': 1466214,
            'May 2020': 3428912,
            'Jun 2020': 2743236,
            'Jul 2020': 3764968,
            'Aug 2020': 1490695,
            'Sep 2020': 2888496,
            'Oct 2020': 2150625,
            'Nov 2020': 2697723,
            'Dec 2020': 1639064,
            'Jan 2021': 843780,
            'Feb 2021': 4193595,
            'Mar 2021': 2527220,
            'Apr 2021': 1017585,
            'May 2021': 714264,
            'Jun 2021': 2867355
          }
        },
        {
          id: 'orders',
          label: 'Orders',
          // value: '1',
          value: function(startMonth, endMonth, timeSeriesData) {
            // return startMonth + endMonth;
            let sum = _.sum(Object.values(timeSeriesData).splice(startMonth, endMonth));
            return sum;
          },
          time_series_data: {
            'Jan 2020': 2140,
            'Feb 2020': 3385,
            'Mar 2020': 2205,
            'Apr 2020': 2618,
            'May 2020': 1475,
            'Jun 2020': 2482,
            'Jul 2020': 3012,
            'Aug 2020': 1587,
            'Sep 2020': 2456,
            'Oct 2020': 1373,
            'Nov 2020': 2135,
            'Dec 2020': 2350,
            'Jan 2021': 2146,
            'Feb 2021': 2334,
            'Mar 2021': 2394,
            'Apr 2021': 1004,
            'May 2021': 4782,
            'Jun 2021': 2419
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
      const startMonth = 3;
      const endMonth = 16;

      const labels = ["Jan 20", "Feb 20", "Mar 20", "Apr 20", "May 20", "Jun 20", "Jul 20", "Aug 20", "Sep 20", "Oct 20", "Nov 20", "Dec 20", "Jan 21", "Feb 21", "Mar 21", "Apr 21", "May 21", "Jun 21"].slice(startMonth, endMonth);
      let datasets = [];

      const activeTopBarMetrics = _.filter(this.selectedView.metricsTopBar, metric => {
        return metric.active === true;
      })

      _.each(activeTopBarMetrics, tbm => {
        let metric = _.find(this.metrics, {id: tbm.metric_id});
        datasets.push({
          label: metric.label,
          data: Object.values(metric.time_series_data).slice(startMonth, endMonth),
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
      // this.viewChangerVisible = false;
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
      this.viewChangerVisible = false;
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
    },

    openInsightsTab() {
      this.insightsTabVisible = true;
    },

    closeInsightsTab() {
      this.insightsTabVisible = false;
    },

    openShareTab() {
      this.shareTabVisible = true;
    },

    closeShareTab() {
      this.shareTabVisible = false;
    },

    openInsightResultsTab() {
      this.insightResultsTabVisible = true;
    },

    closeInsightResultsTab() {
      this.insightResultsTabVisible = false;
    },

    getInsight() {
      this.openInsightResultsTab();
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

.view-selector {
  margin-bottom: 20px;
}

.view-selector:last-child {
  margin-bottom: 0 !important;
}

.view-selector img {
  max-width: 100%;
  border-radius: 5px;
  border: 2px solid #eee;
}

.view-selector img.selected {
  border: 2px solid #4dc8f2;
}

.view-selector:hover {
  cursor: pointer;
}

.view-selector:hover img {
  border: 2px solid #4dc8f2;
}

.view-selector .ant-card-body {
  padding-top: 11px;
}

.view-selector .ant-card-meta-detail {
  text-align: center;
}

.button-header {
  border: none !important;
  box-shadow: none !important;
}

.button-header:hover {
  background: rgb(55, 53, 179);
  color: #fff;
}

.collapse-margin-bottom {
  margin-bottom: 20px;
}

.ant-collapse-content-box .ant-btn, .ant-collapse-content-box .ant-btn span {
  width: 100%;
  word-wrap: break-word;
  height: auto;
  white-space: normal;
  text-align: left;
  padding-top: 5px;
  padding-bottom: 5px;
}

.ant-collapse-content-box .ant-btn {
  margin-bottom: 15px;
}

.ant-collapse-content-box .ant-btn:last-child {
  margin-bottom: 0 !important;
}

.insight-results-drawer .ant-drawer-body {
  background: #f7fafc;
}

.insight-results-question {
  margin-bottom: 30px;
}

.button-margin-bottom {
  margin-bottom: 15px;
}

.share-button {
  text-align: left;
  height: 50px;
}

.share-button {
  display: flex;
  align-items: center;
}

.share-button i {
  flex-shrink: 1;
}

.share-button-inner {
  padding-left: 20px;
  flex: 1;
  display: flex;
  align-items: center;
}

.share-button-inner .share-button-text {
  flex: 1;
}
</style>