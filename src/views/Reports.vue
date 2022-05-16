<template>
  <div class="reports">
    <div class="page-header">
      <h1 class="page-title">Reports</h1>
      <div class="actions">
        <a-button icon="filter">Filter</a-button>
      </div>
    </div>

    <reports-grid></reports-grid>
  </div>
</template>

<script>
import ReportsGrid from "../components/Reports/ReportsGrid";

export default {
  name: "Reports",
  computed: {},
  components: { ReportsGrid },
  data() {
    return {};
  },
};
</script>
