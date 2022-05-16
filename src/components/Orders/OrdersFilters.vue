<template>
  <a-popover placement="bottomLeft" trigger="click">
    <template slot="title">
      <div class="filter-title-wrapper">
        <div class="left">
          <a-button size="small" @click.prevent="clear">Clear</a-button>
        </div>
        <div class="center">Filters</div>
        <div class="right">
          <a-button :key="unsavedReloadKey" :disabled="!hasUnsavedChanges" @click="save" type="primary" size="small"
            >Save
          </a-button>
        </div>
      </div>
    </template>
    <template slot="content">
      <div class="filters-inner">
        <inline-filter
          :filters="filtersLocal"
          id="product_type"
          label="Type"
          type="categorical"
          @filter-updated="handleFilterUpdated"
          :options="typeOptions"
        ></inline-filter>

        <!--        <inline-filter :filters="filtersLocal"-->
        <!--                       id="product_type"-->
        <!--                       label="Order Type"-->
        <!--                       type="categorical"-->
        <!--                       @filter-updated="handleFilterUpdated"-->
        <!--                       :options="typeOptions"></inline-filter>-->
      </div>
    </template>
    <a-button icon="filter">Filter</a-button>
  </a-popover>
</template>

<script>
import InlineFilter from "./InlineFilter";

const _ = require("lodash");

export default {
  name: "OrdersFilters",
  props: ["filters"],
  components: { InlineFilter },
  data() {
    return {
      filtersLocal: null,
      hasUnsavedChangesFromEvent: false,
      unsavedReloadKey: 1,
      typeOptions: [
        {
          value: "ERP",
          label: "ERP",
        },
        {
          value: "print",
          label: "Print",
        },
        {
          value: "pos",
          label: "POS",
        },
        {
          value: "apparel",
          label: "Apparel",
        },
        {
          value: "merchandise",
          label: "Merchandise",
        },
        {
          value: "packaging",
          label: "Packaging",
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

      if (this.filters["product_type"] !== this.filtersLocal["product_type"]) {
        hasUnsaved = true;
      }

      return hasUnsaved || this.hasUnsavedChangesFromEvent;
    },
  },
  methods: {
    handleFilterUpdated() {
      // this.incrementUnsavedReloadKey();
      // this.$emit('filter-updated');
      this.hasUnsavedChangesFromEvent = true;
      // console.log('hasUnsavedChangesFromEvent = true');
    },

    incrementUnsavedReloadKey() {
      this.unsavedReloadKey += 1;
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

<style scoped>
.filters-inner {
  min-width: 200px;
}
</style>
