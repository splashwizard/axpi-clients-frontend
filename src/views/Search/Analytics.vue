<template>
  <a-layout>
    <left-sidebar></left-sidebar>
    <a-layout style="padding: 7px 30px">
      <h1 class="page-title">Analytics</h1>
      <a-tabs default-active-key="view">
      <a-tab-pane key="view" tab="View">
        <analytics-view />
      </a-tab-pane>
      <a-tab-pane key="searches" tab="Searches">
        <analytics-search />
      </a-tab-pane>
      <a-tab-pane key="searches_without_results" tab="Searches without Results">
        Searches without Results
      </a-tab-pane>
      <a-tab-pane key="searches_without_clicks" tab="Searches without Clicks">
        Searches without clicks
      </a-tab-pane>
      <a-tab-pane key="results" tab="Results">
        Results
      </a-tab-pane>
      <a-tab-pane key="filters" tab="Filters">
        Filters
      </a-tab-pane>
    </a-tabs>
    </a-layout>
  </a-layout>
</template>

<script>

import LeftSidebar from "./LeftSidebar";
import AnalyticsView from "./Analytics/View";
import AnalyticsSearch from "./Analytics/Searches";

export default {
  name: "Landing",
  components: { LeftSidebar, AnalyticsView, AnalyticsSearch }
}
</script>

<style scoped>

</style>