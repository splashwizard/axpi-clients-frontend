<template>
  <a-popover v-model="filtersVisible" title="Filters" trigger="click">
    <a slot="content">
      <!-- Loading -->
      <div class="loading center" v-if="isLoadingFilters">
        <a-spin></a-spin>
      </div>
      <!-- / Loading -->

      <!-- Loaded -->
      <div class="loaded" v-if="!isLoadingFilters">
        <div style="margin-bottom: 10px">
          <a-checkbox v-model="filter_by_supplier">Filter by supplier</a-checkbox>
          <div v-if="filter_by_supplier === true">
            <a-select
              style="width: 100%; margin-top: 15px; margin-bottom: 10px"
              v-model="selected_supplier_id"
              show-search
              placeholder="Select supplier"
            >
              <a-select-option v-for="(supplier, i) in suppliers" :key="i" :value="supplier.id"
                >{{ supplier.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div>
          <a-checkbox v-model="filter_by_specification">Filter by specification</a-checkbox>
          <div v-if="filter_by_specification === true">
            <a-select
              style="width: 100%; margin-top: 15px; margin-bottom: 10px"
              v-model="selected_specification_id"
              show-search
              placeholder="Select specification"
            >
              <a-select-option
                v-for="(specification, i) in optimisationSpecifications"
                :key="i"
                :value="specification.id"
                >{{ specification.product_name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <!-- / Loaded -->
    </a>
    <a-button type="secondary" class="button-header" size="large" shape="circle" icon="filter"></a-button>
  </a-popover>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

const _ = require("lodash");

export default {
  name: "AnalyticsFilters",
  props: ["optimisationId"],
  data() {
    return {
      filtersVisible: false,
    };
  },
  computed: {
    ...mapGetters("optimisationAnalyticsManager", {
      isLoadingFilters: "isLoadingFilters",
      filters: "filters",
      filterBySupplier: "filterBySupplier",
      filterBySpecification: "filterBySpecification",
      suppliers: "suppliers",
      optimisationSpecifications: "optimisationSpecifications",
      selectedSupplier: "selectedSupplier",
      selectedSpecification: "selectedSpecification",
    }),

    filter_by_supplier: {
      get() {
        return this.filterBySupplier;
      },
      set(val) {
        if (val) {
          this.setFilterBySupplier(true);
        } else {
          this.setFilterBySupplier(false);
        }
      },
    },

    filter_by_specification: {
      get() {
        return this.filterBySpecification;
      },
      set(val) {
        if (val) {
          this.setFilterBySpecification(true);
        } else {
          this.setFilterBySpecification(false);
        }
      },
    },

    selected_supplier_id: {
      get() {
        return this.selectedSupplier ? this.selectedSupplier.id : null;
      },
      set(id) {
        this.setSelectedSupplier(_.find(this.suppliers, { id: id }));
      },
    },

    selected_specification_id: {
      get() {
        return this.selectedSpecification ? this.selectedSpecification.id : null;
      },
      set(id) {
        this.setSelectedSpecification(_.find(this.optimisationSpecifications, { id: id }));
      },
    },
  },
  created() {
    this.loadFilters(this.optimisationId);
  },
  methods: {
    ...mapActions("optimisationAnalyticsManager", {
      loadFilters: "loadFilters",
      setFilterBySupplier: "setFilterBySupplier",
      setFilterBySpecification: "setFilterBySpecification",
      setSelectedSupplier: "setSelectedSupplier",
      setSelectedSpecification: "setSelectedSpecification",
    }),
  },
};
</script>

<style scoped></style>
