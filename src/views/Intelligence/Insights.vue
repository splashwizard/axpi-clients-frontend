<template>
  <div>
    <a-tabs v-model="activeTab">
      <a-tab-pane key="all-insights" tab="All Insights"></a-tab-pane>
      <!--      <a-tab-pane key="price-insights" tab="Price Insights"> </a-tab-pane>-->
      <!--      <a-tab-pane key="demand-insights" tab="Demand Insights"> </a-tab-pane>-->
      <!--      <a-tab-pane key="contract-insights" tab="Contract Insights"> </a-tab-pane>-->
    </a-tabs>

    <!-- Loading -->
    <div v-if="isLoading" class="loader">
      <a-spin></a-spin>
      <span class="loader-description">Loading all insights...</span>
    </div>
    <!-- / Loading -->

    <!-- Insights -->
    <div class="insights" v-if="!isLoading && activeTab === 'all-insights'">

      <a-row :gutter="20">
        <a-col :span="6" v-for="(insight, i) in insightsToShow" :key="i">
          <a-card :hoverable="true" @click.prevent="() => navigateToCluster(insight['cluster_id'])">
            <a-statistic :title="insight.description"
                         prefix="$"
                         :precision="0"
                         :value="insight.amount"/>

            <div class="insight-card-bottom">
              <div class="left">
                {{ insight.opportunities }}
                {{ insight.opportunities == 1 ? 'opportunity' : 'opportunities' }}
              </div>
              <div class="right">
                View
                <a-icon type="right"/>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

    </div>
    <!-- / Insights -->
  </div>
</template>

<script>
import axios from 'axios';

const _ = require('lodash');

export default {
  data() {
    return {
      activeTab: "all-insights",
      isLoading: false,
      allInsights: []
    };
  },

  created() {
    this.fetch();
  },

  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/intelligence/all-insights').then(r => {
        vm.isLoading = false;
        vm.allInsights = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.allInsights = null;
        vm.$message.error('Error loading all insights');
      });
    },

    navigateToCluster(clusterId) {
      this.$router.push('/intelligence/clusters/' + clusterId);
    }
  },

  computed: {
    insightsToShow() {
      let insightCards = [];

      _.each(this.allInsights, (clusterInsights, clusterId) => {
        let groupedByType = _.groupBy(clusterInsights, 'insight_type');
        _.each(groupedByType, (insights, insightType) => {
          let groupedByErpOrderId = _.groupBy(insights, 'erp_order_id');
          let numberOfOpportunities = Object.keys(groupedByErpOrderId).length;

          let potentialSavings = 0;
          _.each(groupedByErpOrderId, insightsForErpOrder => {
            potentialSavings += _.max(_.map(insightsForErpOrder, 'potential_savings'));
          });

          let description = 'Unknown';
          if (insightType === 'pricing') {
            description = 'Pricing Outliers';
          }

          insightCards.push({
            cluster_id: clusterId,
            amount: potentialSavings,
            opportunities: numberOfOpportunities,
            description: description
          });
        });
      });

      return insightCards;
    }
  }
};
</script>

<style scoped lang="scss">
.loader {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid #ECECEC;
}

.loader-description {
  margin-left: 10px;
}

.insight-card-bottom {
  padding-top: 25px;
  display: flex;
  flex-direction: row;

  .left {
    flex-grow: 1;
  }

  .right {
    flex-shrink: 1;
  }
}
</style>