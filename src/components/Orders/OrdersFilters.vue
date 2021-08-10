<template>
  <a-popover placement="bottomLeft" trigger="click">
    <template slot="content">
      <div class="filters-inner">
        asdf
      </div>
    </template>
    <a-button icon="filter">Filter</a-button>
  </a-popover>
</template>

<script>
export default {
  name: "OrdersFilters"
}
</script>

<style scoped>
.filters-inner {
  min-width: 200px;
}
</style>