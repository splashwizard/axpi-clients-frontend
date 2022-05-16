<template>
  <div>
    <a-tabs v-model="activeTab">
      <a-tab-pane key="all-insights" tab="All Insights"></a-tab-pane>
      <a-tab-pane key="price-insights" tab="Price Insights"></a-tab-pane>
      <a-tab-pane key="demand-insights" tab="Demand Insights"></a-tab-pane>
      <!--            <a-tab-pane key="contract-insights" tab="Contract Insights"> </a-tab-pane>-->
    </a-tabs>

    <!-- Loading -->
    <div v-if="isLoading" class="loader">
      <a-spin></a-spin>
      <span class="loader-description">Loading all insights...</span>
    </div>
    <!-- / Loading -->

    <!-- Insights -->
    <div class="insights" v-if="!isLoading">
      <a-row :gutter="20">
        <a-col :span="6" v-for="(insight, i) in insightsToShow" :key="i">
          <a-card class="insight-card" :hoverable="true" @click.prevent="() => handleInsightClicked(insight)">
            <a-statistic :title="insight.description" prefix="$" :precision="0" :value="insight.amount" />

            <div class="insight-card-bottom">
              <div class="left">
                {{ insight.opportunities }}
                {{ insight.opportunities == 1 ? "opportunity" : "opportunities" }}
              </div>
              <div class="right">
                View
                <a-icon type="right" />
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
import axios from "axios";

const _ = require("lodash");

export default {
  props: ["filters"],

  data() {
    return {
      activeTab: "all-insights",
      isLoading: false,
      allInsights: [],
    };
  },

  created() {
    this.fetch();
  },

  methods: {
    getSearchParams() {
      let filters = {};

      _.each(this.filters["filters_enabled"], (key) => {
        filters[key] = this.filters[key];
      });

      return filters;
    },

    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/intelligence/all-insights", this.getSearchParams())
        .then((r) => {
          vm.isLoading = false;
          vm.allInsights = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.allInsights = null;
          vm.$message.error("Error loading all insights");
        });
    },

    handleInsightClicked(insight) {
      this.$router.push("/intelligence/clusters?insight_type=" + insight["insight_type"]);
    },
  },

  computed: {
    allInsightsCollapsed() {
      let collapsed = [];
      _.each(this.allInsights, (clusterInsights) => {
        collapsed.push(clusterInsights);
        collapsed = _.flatten(collapsed);
      });
      return collapsed;
    },

    insightsToShow() {
      let insightCards = [];

      let groupedByType = _.groupBy(this.allInsightsCollapsed, "insight_type");
      _.each(groupedByType, (insights, insightType) => {
        console.log(insights);
        let groupedByErpOrderId = _.groupBy(insights, "erp_order_id");
        // let numberOfOpportunities = Object.keys(groupedByErpOrderId).length;

        let groupedByClusterId = _.groupBy(insights, "cluster_id");
        // console.log(groupedByClusterId);
        let numberOfOpportunities = Object.keys(groupedByClusterId).length;

        let potentialSavings = 0;
        _.each(groupedByErpOrderId, (insightsForErpOrder) => {
          potentialSavings += _.max(_.map(insightsForErpOrder, "potential_savings"));
        });

        let description = "Unknown";
        if (insightType === "pricing") {
          description = "Pricing Outliers";
        }

        insightCards.push({
          // cluster_id: clusterId,
          amount: potentialSavings,
          opportunities: numberOfOpportunities,
          insight_type: insightType,
          description: description,
        });
      });

      // Add in 0-value insights
      let pricingOutliersCard = _.find(insightCards, { insight_type: "pricing" });
      if (!pricingOutliersCard) {
        insightCards.push({
          amount: 0,
          opportunities: 0,
          insight_type: "pricing",
          description: "Pricing Outliers",
        });
      }

      let demandAggregationCard = _.find(insightCards, { insight_type: "demand-aggregration" });
      if (!demandAggregationCard) {
        insightCards.push({
          amount: 0,
          opportunities: 0,
          insight_type: "demand-aggregation",
          description: "Demand Aggregation",
        });
      }

      let alternativeProductCard = _.find(insightCards, { insight_type: "alternative-product" });
      if (!alternativeProductCard) {
        insightCards.push({
          amount: 0,
          opportunities: 0,
          insight_type: "alternative-product",
          description: "Alternative Product",
        });
      }

      let contractNegotiationCard = _.find(insightCards, { insight_type: "contract-negotiation" });
      if (!contractNegotiationCard) {
        insightCards.push({
          amount: 0,
          opportunities: 0,
          insight_type: "contract-negotiation",
          description: "Contract Negotiation",
        });
      }

      let stockpilingAdvisedCard = _.find(insightCards, { insight_type: "stockpiling-advised" });
      if (!stockpilingAdvisedCard) {
        insightCards.push({
          amount: 0,
          opportunities: 0,
          insight_type: "stockpiling-advised",
          description: "Stockpiling Advised",
        });
      }

      let expandedDemandIncreasesCard = _.find(insightCards, { insight_type: "expected-demand-increases" });
      if (!expandedDemandIncreasesCard) {
        insightCards.push({
          amount: 0,
          opportunities: 0,
          insight_type: "expected-demand-increases",
          description: "Expected Demand Increases",
        });
      }

      let unmatchedOrdersCard = _.find(insightCards, { insight_type: "unmatched-orders" });
      if (!unmatchedOrdersCard) {
        insightCards.push({
          amount: 0,
          opportunities: 0,
          insight_type: "unmatched-orders",
          description: "Unmatched Orders",
        });
      }

      return _.filter(insightCards, (insightCard) => {
        if (this.activeTab === "all-insights") {
          return true;
        } else if (this.activeTab === "price-insights") {
          return ["pricing"].includes(insightCard["insight_type"]);
        } else if (this.activeTab === "demand-insights") {
          return !["pricing"].includes(insightCard["insight_type"]);
        }
        return false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.loader {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid #ececec;
}

.loader-description {
  margin-left: 10px;
}

.insight-card {
  margin-bottom: 22px;
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
