<template>
  <a-popover placement="bottomLeft" trigger="click">
    <template slot="content">
      <div class="filters-inner">

        <inline-filter :filters="filters"
                       id="product_type"
                       label="Order Type"
                       type="categorical"
                       @filter-updated="handleFilterUpdated"
                       :options="typeOptions"></inline-filter>

      </div>
    </template>
    <a-button icon="filter">Filter</a-button>
  </a-popover>
</template>

<script>
import InlineFilter from "./InlineFilter";

export default {
  name: "OrdersFilters",
  props: ['filters'],
  components: {InlineFilter},
  data() {
    return {
      typeOptions: [
        {
          value: 'print',
          label: 'Print'
        },
        {
          value: 'pos',
          label: 'POS'
        },
        {
          value: 'apparel',
          label: 'Apparel'
        },
        {
          value: 'merchandise',
          label: 'Merchandise'
        },
        {
          value: 'packaging',
          label: 'Packaging'
        }
      ]
    }
  },
  methods: {
    handleFilterUpdated() {
      this.$emit('filter-updated');
    }
  }
}
</script>

<style scoped>
.filters-inner {
  min-width: 200px;
}
</style>