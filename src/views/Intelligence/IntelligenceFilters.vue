<template>
  <a-popover placement="bottomLeft" trigger="click">
    <template slot="content">
      <div class="filters-inner">

        <inline-filter :filters="filters"
                       id="date_range"
                       label="Date range"
                       type="categorical"
                       @filter-updated="handleFilterUpdated"
                       :options="dateRangeOptions"></inline-filter>

      </div>
    </template>
    <a-button icon="filter">Filter</a-button>
  </a-popover>
</template>

<script>
import InlineFilter from "../../components/Orders/InlineFilter";
export default {
  name: "IntelligenceFilters",
  props: ['filters'],
  components: {InlineFilter},
  data() {
    return {
      dateRangeOptions: [
        {
          value: 'last-5-years',
          label: 'Last 5 years'
        },
        {
          value: 'last-12-months',
          label: 'Last 12 months'
        },
        {
          value: 'last-month',
          label: 'Last month'
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

</style>