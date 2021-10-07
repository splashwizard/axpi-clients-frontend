<template>
  <div class="sidebar-wrapper">
    <!-- Top -->
    <div class="top">
      <!-- Header -->
      <a-page-header title="Insights" @back="$emit('close')"></a-page-header>
      <!-- / Header -->

      <b style="display: block; padding-bottom: 20px;">Not showing properly where refactoring to be like Lucidchart</b>

      <b style="display: block; padding-bottom: 20px;">Showing insights for ERP order ID: {{ erpOrderId }}</b>

      <insights-table :insights="insights" :selected-order-id="erpOrderId"></insights-table>

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
    return {};
  },
  watch: {
    searchQuery: function () {
    },
  },
  created() {
  },
  methods: {},

  computed: {},
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