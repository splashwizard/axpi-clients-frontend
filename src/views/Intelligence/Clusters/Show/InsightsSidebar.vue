<template>
  <div class="sidebar-wrapper">
    <!-- Top -->
    <div class="top">
      <!-- Header -->
      <a-page-header :title="headerTitle" @back="handleBack"></a-page-header>
      <!-- / Header -->

      <b style="display: block; padding-bottom: 20px;">Not showing properly where refactoring to be like Lucidchart</b>

      <b style="display: block; padding-bottom: 20px;">Showing insights for ERP order ID: {{ erpOrderId }}</b>

      <insights-table @set-insight-type="setInsightType"
                      v-if="insightType === null" :insights="insights" :selected-order-id="erpOrderId"></insights-table>

      <div v-if="insightType">
        {{ insightType }} insights will be shown here
      </div>

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

// const _ = require("lodash");
// import Insight from "./InsightsSidebar/Insight";
import InsightsTable from "./InsightsSidebar/InsightsTable";

export default {
  name: "InsightsSidebar",
  props: ["clusterId", "insights", "erpOrderId"],
  components: {InsightsTable},
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