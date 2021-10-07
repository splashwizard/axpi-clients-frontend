<template>
  <div class="sidebar-wrapper">
    <!-- Top -->
    <div class="top">
      <!-- Header -->
      <a-page-header :title="headerTitle" @back="handleBack"></a-page-header>
      <!-- / Header -->

      <!--      <b style="display: block; padding-bottom: 20px;">Not showing properly where refactoring to be like Lucidchart</b>-->
      <!--      <b style="display: block; padding-bottom: 20px;">Showing insights for ERP order ID: {{ erpOrderId }}</b>-->

      <insights-summary-table v-if="insightType === null"
                              @set-insight-type="setInsightType"
                              :insights="insights"
                              :selected-order-id="erpOrderId"></insights-summary-table>

      <group-insights-table v-if="insightType"
                            :insights="groupInsightsToShow"></group-insights-table>

      <!--      <insight v-for="(theInsight, i) in insights" :key="i" :insight="theInsight"></insight>-->
    </div>
    <!-- / Top -->

    <!-- Bottom -->
    <div class="bottom">

    </div>
    <!-- / Bottom -->
  </div>
</template>

<script>
// import axios from "axios";

const _ = require("lodash");
// import Insight from "./InsightsSidebar/Insight";
import InsightsSummaryTable from "./InsightsSidebar/InsightsSummaryTable";
import GroupInsightsTable from "./InsightsSidebar/GroupInsightsTable";

export default {
  name: "InsightsSidebar",
  props: ["clusterId", "insights", "erpOrderId"],
  components: {InsightsSummaryTable, GroupInsightsTable},
  data() {
    return {
      insightType: null
    };
  },
  watch: {
    erpOrderId: function () {
      this.insightType = null;
    },
  },
  created() {
  },
  methods: {
    setInsightType(type) {
      this.insightType = type;
    },

    handleBack() {
      if (this.insightType) {
        this.insightType = null;
      } else {
        this.$emit('close');
      }
    }
  },

  computed: {
    headerTitle() {
      if (this.insightType) {
        return this.insightType.charAt(0).toUpperCase() + this.insightType.slice(1) + ' Insights';
      }
      return 'Insights';
    },

    groupInsightsToShow() {
      return _.filter(this.insights, insight => {
        let erpOrderIdFilter = String(insight.erp_order_id) === String(this.erpOrderId);
        let erpTypeFilter = String(insight.insight_type) === String(this.insightType);
        return erpOrderIdFilter && erpTypeFilter;
      });
    }
  },
};
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  .top {
    flex: 1;
    padding: 5px 20px;
    overflow-y: scroll;
  }

  .bottom {
    flex-shrink: 1;
    background: #fff;
    padding: 15px 20px;
    border-top: 1px solid #e3e8ee;
    text-align: right;

    div {
      float: right;

      span {
        margin-right: 20px;
      }
    }
  }
}
</style>