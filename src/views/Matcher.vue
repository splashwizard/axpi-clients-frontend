<template>
  <div class="matcher">

    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <div class="page-header">
            <h1 class="page-title">Orders</h1>
            <div class="actions">
              <a-input-search
                  v-if="currentTab !== 'overview'"
                  placeholder="Search orders"
                  style="width: 200px"
                  v-model="searchQuery"
              />

              <orders-filters
                  v-if="currentTab === 'all-transactions'"
                  @filter-updated="handleFilterUpdated"
                  @set-filters="setFilters"
                  :filters="filters"
              ></orders-filters>
            </div>
          </div>

          <a-tabs v-model="currentTab">
            <a-tab-pane key="overview" tab="Overview">
              <matcher-overview></matcher-overview>
            </a-tab-pane>
            <a-tab-pane key="uncategorized" tab="Unmatched Orders">
              <unmatched-orders-table :search-query="searchQuery"
                                      :reload-key="reloadKey"></unmatched-orders-table>
            </a-tab-pane>
            <a-tab-pane key="all-transactions" tab="All Orders">
              <all-orders-table :search-query="searchQuery" :filters="filters"
                                :reload-key="reloadKey"></all-orders-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout>
      <a-layout-sider width="500" theme="dark"
                      :style="{ background: '#f7fafc', borderLeft: '1px solid #e3e8ee' }"
                      :collapsed-width="0" v-model="shouldHideSidebar" :trigger="null" collapsible>
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
import eventBus from "../event-bus";
import OrdersFilters from "../components/Orders/OrdersFilters";

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
    UnmatchedOrdersTable, AllOrdersTable, MatcherSidebar, MatcherOverview, OrdersFilters
  },
  data() {
    return {
      currentTab: 'overview',

      searchQuery: '',
      filters: {
        filters_enabled: {},
      }
    }
  },
  created() {
    if (this.$route.query.orderId) {
      this.currentTab = 'all-transactions';
    }
  },
  methods: {
    ...mapActions('matcher', {
      selectErpOrder: 'selectErpOrder'
    }),

    setFilters(filters) {
      this.filters = filters;
    },

    handleFilterUpdated() {
      eventBus.$emit('order-filter-updated');
    }
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