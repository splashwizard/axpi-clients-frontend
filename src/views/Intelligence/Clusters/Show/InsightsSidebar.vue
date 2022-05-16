<template>
  <div class="sidebar-wrapper">
    <!-- Top -->
    <div class="top">
      <loading-screen :is-loading="isSaving"></loading-screen>

      <!-- Header -->
      <a-page-header :title="headerTitle" @back="handleBack"></a-page-header>
      <!-- / Header -->

      <!--      <b style="display: block; padding-bottom: 20px;">Not showing properly where refactoring to be like Lucidchart</b>-->
      <!--      <b style="display: block; padding-bottom: 20px;">Showing insights for ERP order ID: {{ erpOrderId }}</b>-->

      <insights-summary-table
        v-if="insightType === null"
        @set-insight-type="setInsightType"
        :insights="insights"
        :selected-order-id="erpOrderId"
      ></insights-summary-table>

      <group-insights-table
        v-if="insightType"
        @toggle-insight-applied="toggleInsightApplied"
        :insights-applied-local="insightsAppliedLocal"
        :insights="groupInsightsToShow"
      ></group-insights-table>

      <!--      <insight v-for="(theInsight, i) in insights" :key="i" :insight="theInsight"></insight>-->
    </div>
    <!-- / Top -->

    <!-- Bottom -->
    <div class="bottom">
      <div>
        <a-button type="primary" @click.prevent="persistInsightsApplied" :disabled="!needsToSaveInsightsApplied"
          >Save
        </a-button>
      </div>
    </div>
    <!-- / Bottom -->
  </div>
</template>

<script>
import axios from "axios";

const _ = require("lodash");
import LoadingScreen from "../../../../components/LoadingScreen";
// import Insight from "./InsightsSidebar/Insight";
import InsightsSummaryTable from "./InsightsSidebar/InsightsSummaryTable";
import GroupInsightsTable from "./InsightsSidebar/GroupInsightsTable";
import { mapGetters } from "vuex";

export default {
  name: "InsightsSidebar",
  props: ["clusterId", "erpOrderId", "insightsApplied"],
  components: { InsightsSummaryTable, GroupInsightsTable, LoadingScreen },
  data() {
    return {
      insightType: null,
      insightsAppliedSaved: [],
      insightsAppliedLocal: [],
      isSaving: false,
    };
  },
  watch: {
    erpOrderId: function () {
      this.insightType = null;
      this.insightsAppliedLocal = _.cloneDeep(this.insightsApplied);
    },
  },
  created() {
    this.insightsAppliedSaved = _.cloneDeep(this.insightsApplied);
    this.insightsAppliedLocal = _.cloneDeep(this.insightsApplied);
  },
  methods: {
    setInsightType(type) {
      this.insightType = type;
    },

    handleBack() {
      if (this.insightType) {
        this.insightType = null;
      } else {
        this.$emit("close");
      }
    },

    toggleInsightApplied(insight) {
      this.insightsAppliedLocal = _.xor(this.insightsAppliedLocal, [insight["insight_id"]]);
    },

    persistInsightsApplied() {
      if (!this.needsToSaveInsightsApplied) {
        return false;
      }
      let vm = this;
      vm.isSaving = true;
      axios
        .put(window.API_BASE + "/intelligence/clusters/" + this.clusterId, {
          insight_ids: vm.insightsAppliedLocal,
        })
        .then(() => {
          vm.$emit("insights-saved", vm.insightsAppliedLocal);
          vm.insightsAppliedSaved = vm.insightsAppliedLocal;
          vm.$message.success("Insights saved successfully");
          vm.isSaving = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error saving insights");
        });
    },
  },

  computed: {
    ...mapGetters("clusterViewer", {
      insights: "insights",
    }),

    headerTitle() {
      if (this.insightType) {
        return this.insightType.charAt(0).toUpperCase() + this.insightType.slice(1) + " Insights";
      }
      return "Insights";
    },

    groupInsightsToShow() {
      return _.filter(this.insights, (insight) => {
        let erpOrderIdFilter = String(insight.erp_order_id) === String(this.erpOrderId);
        let erpTypeFilter = String(insight.insight_type) === String(this.insightType);
        return erpOrderIdFilter && erpTypeFilter;
      });
    },

    needsToSaveInsightsApplied() {
      let diffOne = _.difference(this.insightsAppliedLocal, this.insightsAppliedSaved);
      let diffTwo = _.difference(this.insightsAppliedSaved, this.insightsAppliedLocal);
      return _.union(diffOne, diffTwo).length > 0;
    },
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
