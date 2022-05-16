<template>
  <a-popover placement="bottomRight" trigger="click">
    <template slot="title">
      <div class="filter-title-wrapper">
        <div class="left">
          <a-button size="small" @click.prevent="clear">Clear</a-button>
        </div>
        <div class="center">Filters</div>
        <div class="right">
          <a-button :disabled="!hasUnsavedChanges" @click="save" type="primary" size="small">Save </a-button>
        </div>
      </div>
    </template>
    <template slot="content">
      <div class="filters-inner">
        <inline-filter
          :filters="filtersLocal"
          id="date_range"
          label="Date range"
          type="categorical"
          @filter-updated="handleFilterUpdated"
          :options="dateRangeOptions"
        ></inline-filter>

        <!--        <inline-filter :filters="filters"-->
        <!--                       id="date_range"-->
        <!--                       label="Date range"-->
        <!--                       type="categorical"-->
        <!--                       @filter-updated="handleFilterUpdated"-->
        <!--                       :options="dateRangeOptions"></inline-filter>-->
      </div>
    </template>
    <a-button icon="filter">Filter</a-button>
  </a-popover>
</template>

<script>
import InlineFilter from "../../components/Orders/InlineFilter";

const _ = require("lodash");

export default {
  name: "IntelligenceFilters",
  props: ["filters"],
  components: { InlineFilter },
  data() {
    return {
      filtersLocal: null,
      hasUnsavedChangesFromEvent: false,
      dateRangeOptions: [
        {
          value: "last-5-years",
          label: "Last 5 years",
        },
        {
          value: "last-12-months",
          label: "Last 12 months",
        },
        {
          value: "last-month",
          label: "Last month",
        },
      ],
    };
  },
  created() {
    this.filtersLocal = _.cloneDeep(this.filters);
  },
  computed: {
    hasUnsavedChanges() {
      let hasUnsaved = false;

      let diffOne = _.difference(this.filters.filters_enabled, this.filtersLocal.filters_enabled);
      let diffTwo = _.difference(this.filtersLocal.filters_enabled, this.filters.filters_enabled);
      if (_.merge(diffOne, diffTwo).length) {
        hasUnsaved = true;
      }

      return hasUnsaved || this.hasUnsavedChangesFromEvent;
    },
  },
  methods: {
    handleFilterUpdated() {
      // this.$emit('filter-updated');
      this.hasUnsavedChangesFromEvent = true;
    },

    clear() {
      this.filtersLocal.filters_enabled = [];
    },

    save() {
      this.$emit("set-filters", _.cloneDeep(this.filtersLocal));
      this.$emit("filter-updated");
      this.hasUnsavedChangesFromEvent = false;
    },
  },
};
</script>

<style scoped></style>
