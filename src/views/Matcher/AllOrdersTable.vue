<template>
  <div>
    <loading-screen :is-loading="isSaving"></loading-screen>
    <a-table
      class="axpi-table"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataToShow"
      :pagination="pagination"
      :loading="loading || searchQueryIsDirty"
      @change="handleTableChange"
    >
      <div slot="type" slot-scope="type, row">
        <div v-if="isErpOrder(row)">ERP</div>
        <div v-else>
          {{ formatType(type) }}
        </div>
      </div>
      <div slot="cost" slot-scope="cost">
        {{ formatCostInPence({ cost_currency: "USD", cost: cost }) }}
      </div>
      <div slot="status" slot-scope="status, row">
        <div v-if="isErpOrder(row)">
          <a-badge :count="getStatus(row)" :number-style="getStatusBadgeStyle(row)"></a-badge>
        </div>
        <div v-else>
          <a-badge
            :count="getHumanReadableStatus(row.status)"
            :number-style="getStatusBadgeStyle(row.status)"
          ></a-badge>
        </div>
      </div>
      <div slot="actions" class="table-actions" slot-scope="actions, row">
        <div v-if="isErpOrder(row)">
          <a-button block v-if="!hasMatches(row)" type="default" @click="selectErpOrder(row)">Match</a-button>
          <a-button block v-if="hasMatches(row)" type="primary" @click="selectErpOrder(row)">Edit</a-button>
        </div>
        <div v-else>
          <a-button block v-if="canRequestInformation(row)" type="default" @click="requestInformation(row)"
            >Request Info
          </a-button>
        </div>
      </div>
      <div slot="dropdown" class="table-actions" slot-scope="actions, record">
        <a-dropdown :trigger="['click']">
          <a-button type="link" icon="ellipsis" @click.prevent="(e) => e.preventDefault()"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" @click="$emit('edit-order', record)">Edit</a>
            </a-menu-item>
            <a-menu-item>
              <a href="#" class="text-danger" @click="archive(record)">Archive</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-table>
  </div>
</template>

<script>
import axios from "axios";

const _ = require("lodash");
import { mapActions, mapGetters } from "vuex";
import eventBus from "../../event-bus";
import Orders from "../../mixins/Orders";
import LoadingScreen from "../../components/LoadingScreen";

const columns = [
  {
    title: "Name",
    dataIndex: "product_name",
    sorter: true,
  },
  {
    title: "Type",
    dataIndex: "product_type",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "PO Number",
    dataIndex: "reference_number",
    sorter: true,
  },
  {
    title: "Cost",
    dataIndex: "cost",
    scopedSlots: { customRender: "cost" },
    sorter: true,
  },
  // {
  //   title: 'Manufacturer',
  //   dataIndex: 'Manufacturer',
  //   sorter: true
  // },
  {
    title: "Vendor",
    dataIndex: "supplier.name",
    sorter: true,
  },
  // {
  //   title: 'Vendor Product ID',
  //   dataIndex: 'properties.vendor_product_id',
  //   sorter: true
  // },
  {
    title: "Status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
  {
    title: "",
    scopedSlots: { customRender: "dropdown" },
    width: 10,
  },
];

export default {
  props: ["reloadKey", "searchQuery", "filters"],
  name: "AllOrdersTable",
  components: { LoadingScreen },
  mixins: [Orders],
  data() {
    return {
      data: [],
      pagination: {},
      searchQueryIsDirty: false,
      loading: false,
      columns,
      isSaving: false,
      archived: [],
    };
  },
  mounted() {
    this.fetch();

    eventBus.$on("order-filter-updated", () => {
      this.fetch();
    });

    eventBus.$on("order-matched", (params) => {
      // let {erp_order_id, matches, matches_selected_from_suggestion, matches_selected_manually} = params;
      let { order_id, matches } = params;
      this.data = _.map(this.data, (d) => {
        if (d["id"] === order_id) {
          return {
            ...d,
            matches,
            // matches_selected_from_suggestion,
            // matches_selected_manually
          };
        }
        return d;
      });
    });
  },
  beforeDestroy() {
    eventBus.$off("order-matched");
  },
  watch: {
    reloadKey() {
      // this.fetch();
    },

    orderUpdatedReloadKey() {
      this.fetch();
    },

    searchQuery: function () {
      this.searchQueryIsDirty = true;
      this.fetch();
    },
  },
  computed: {
    ...mapGetters("matcher", {
      orderUpdatedReloadKey: "orderUpdatedReloadKey",
    }),

    dataToShow() {
      let vm = this;
      return _.filter(this.data, (d) => {
        return !vm.archived.includes(d["id"]);
      });
    },
  },
  methods: {
    ...mapActions("matcher", {
      selectErpOrder: "selectErpOrder",
    }),

    canRequestInformation(order) {
      return order.status == 0 || order.status == 1;
    },

    requestInformation(order) {
      let vm = this;
      vm.isRequestingInformation = true;
      axios
        .post(window.API_BASE + "/request-information", {
          ids: [order.id],
        })
        .then(() => {
          vm.isRequestingInformation = false;
          vm.$message.success("Information requested successfully");
          vm.fetch();
        })
        .catch((e) => {
          console.log(e);
          vm.isRequestingInformation = false;
          vm.$message.error("Error requesting information");
        });
    },

    archive(order) {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/matcher/archive-order", {
          order_id: order["id"],
        })
        .then(() => {
          vm.archived.push(order["id"]);
          vm.isSaving = false;
          vm.$message.success("Order archived successfully");
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error archiving order");
          vm.isSaving = false;
        });
    },

    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },

    determineSearchParams(params) {
      let search = {
        results_per_page: 10,
        q: this.searchQuery,
      };

      if (this.filters && this.filters.filters_enabled.length) {
        search.filters = {};
        _.each(this.filters.filters_enabled, (filter) => {
          search.filters[filter] = this.filters[filter];
        });
      }

      if (this.$route.query.orderId) {
        search["order_id"] = this.$route.query.orderId;
      }

      return {
        ...search,
        ...params,
      };
    },

    fetch: _.debounce(function (params = {}) {
      this.loading = true;
      axios
        .post(window.API_BASE + "/matcher/get-all-erp-orders", this.determineSearchParams(params))
        .then((r) => {
          const pagination = { ...this.pagination };
          // Read total count from server
          pagination.total = r.data.total;
          this.loading = false;
          this.data = r.data.data;
          this.pagination = pagination;
          this.searchQueryIsDirty = false;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading orders");
        });
    }, 500),

    handleRecordSelected(order) {
      console.log("Order selected");
      console.log(order);
    },

    hasMatches(order) {
      if (order.matches && order.matches.length > 0) {
        return true;
      }
      return false;
    },

    isErpOrder(order) {
      return order.imported;
    },

    getStatus(order) {
      if (this.hasMatches(order)) {
        return "Matched";
      }
      return "Unmatched";
    },

    getStatusBadgeStyle(order) {
      if (this.hasMatches(order)) {
        return {
          backgroundColor: "#46b98e",
        };
      }
      return {
        backgroundColor: "#4dc8f2",
      };
    },
  },
};
</script>

<style scoped></style>
