<template>
  <a-popover v-model="filtersVisible" title="Filters" trigger="click">
    <a slot="content">
      <div style="margin-bottom: 10px;">
        <a-checkbox>Filter by supplier</a-checkbox>
      </div>
      <div>
        <a-checkbox>Filter by specification</a-checkbox>
      </div>
    </a>
    <a-button type="secondary" class="button-header" size="large" shape="circle"
              icon="filter"></a-button>
  </a-popover>
</template>

<script>
export default {
  name: "AnalyticsFilters",
  data() {
    return {
      filtersVisible: false
    }
  }
}
</script>

<style scoped>

</style>