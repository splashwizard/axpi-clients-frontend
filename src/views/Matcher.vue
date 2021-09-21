<template>
  <div class="matcher">

    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <div class="page-header">
            <h1 class="page-title">Matcher</h1>
          </div>

          <a-tabs v-model="currentTab">
            <a-tab-pane key="overview" tab="Overview">
              <matcher-overview></matcher-overview>
            </a-tab-pane>
            <a-tab-pane key="uncategorized" tab="Unmatched Orders">
              <unmatched-orders-table :reload-key="reloadKey"></unmatched-orders-table>
            </a-tab-pane>
            <a-tab-pane key="all-transactions" tab="All Orders">
              <all-orders-table :reload-key="reloadKey"></all-orders-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout>
      <a-layout-sider width="500" theme="dark"
                      :style="{ background: '#f7fafc', borderLeft: '1px solid #e3e8ee' }"
                      :collapsed-width="0" v-model="shouldHideSidebar" :trigger="null" collapsibl>
          <matcher-sidebar></matcher-sidebar>
      </a-layout-sider>
    </a-layout>
    <!-- / Layout -->
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import UnmatchedOrdersTable from "./Matcher/UnmatchedOrdersTable";
import AllOrdersTable from "./Matcher/AllOrdersTable";
import MatcherSidebar from "./Matcher/MatcherSidebar";
import MatcherOverview from "./Matcher/MatcherOverview";

export default {
  name: "Specifications",
  computed: {
    ...mapGetters('matcher', {
      selectedErpOrder: 'selectedErpOrder',
      reloadKey: 'reloadKey'
    }),

    shouldHideSidebar() {
      return (this.selectedErpOrder == null);
    }
  },
  components: {
    UnmatchedOrdersTable, AllOrdersTable, MatcherSidebar, MatcherOverview
  },
  data() {
    return {
      currentTab: 'overview'
    }
  },
  methods: {
    ...mapActions('matcher', {
      selectErpOrder: 'selectErpOrder'
    }),
  }
}
</script>

<style scoped>
.matcher {
  height: 100%;
  /*padding: 12px 25px;*/
}

.wrapper {
  max-height: 100%;
  overflow-y: scroll;
}
</style>