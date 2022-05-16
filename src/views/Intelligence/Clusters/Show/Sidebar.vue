<template>
  <div class="sidebar-wrapper">
    <loading-screen :is-loading="isSaving"></loading-screen>

    <!-- Top -->
    <div class="top">
      <!-- Header -->
      <a-page-header title="Add Order" @back="$emit('close')"></a-page-header>
      <!-- / Header -->

      <a-tabs>
        <a-tab-pane key="manual" tab="Add Manually">
          <!-- Orders table -->
          <div>
            <div style="margin-bottom: 20px; text-align: left">
              <a-input-search placeholder="Search orders" v-model="searchQuery" style="width: 100%" @search="fetch" />
            </div>

            <a-table
              :key="reloadKey"
              class="axpi-table"
              :columns="columns"
              :row-selection="rowSelection"
              :row-key="(record) => record['_id']"
              :data-source="data"
              :pagination="pagination"
              :loading="loading || searchQueryIsDirty"
              @change="handleTableChange"
            >
              <div slot="name" slot-scope="name, order">
                <!-- TODO: Get most relevant product if more than one product - in which case 0 element may not be the most appropriate match -->
                <div class="product-name-wrapper">
                  <div class="left">
                    <a-avatar style="margin-right: 20px" size="large" :src="order['match_details_images']" />
                  </div>
                  <div class="right">
                    {{ order["match_details_names"][0] }}
                  </div>
                </div>
              </div>
              <div slot="cost" slot-scope="cost">
                {{ formatCost({ cost: cost, cost_currency: "USD" }) }}
              </div>
            </a-table>
          </div>
          <!-- / Orders table -->
        </a-tab-pane>
        <a-tab-pane key="suggested" tab="Suggested Orders"> </a-tab-pane>
      </a-tabs>
    </div>
    <!-- / Top -->

    <!-- Bottom -->
    <div class="bottom">
      <div>
        <span> {{ selectedOrderIds.length }} {{ selectedOrderIds.length === 1 ? "order" : "orders" }} selected </span>
        <a-button @click.prevent="$emit('close')" style="margin-right: 10px" type="default">Cancel</a-button>
        <a-button @click.prevent="save" type="primary" :disabled="!canSave">Add to cluster</a-button>
      </div>
    </div>
    <!-- / Bottom -->
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../../../mixins/Orders";

const _ = require("lodash");

const columns = [
  {
    title: "Name",
    dataIndex: "Name",
    sorter: true,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Cost",
    // dataIndex: "Cost",
    dataIndex: "CHF_FLOAT",
    scopedSlots: { customRender: "cost" },
    sorter: true,
    width: 110,
  },
  // {
  //   title: "PO Number",
  //   dataIndex: "PO Number",
  //   sorter: true,
  // },
];

export default {
  name: "AddOrderToClusterButtonAndModal",
  props: ["clusterId"],
  mixins: [Orders],
  data() {
    return {
      isSaving: false,
      serverErrors: [],

      loading: false,
      data: [],
      pagination: {},
      searchQuery: "",
      searchQueryIsDirty: false,
      selectedOrderIds: [],

      columns,

      reloadKey: 1,
    };
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true;
      this.fetch();
    },
  },
  created() {
    this.setup();
  },
  methods: {
    setup() {
      this.data = [];
      this.pagination = {};
      this.searchQueryIsDirty = false;
      this.selectedOrderIds = [];

      this.reloadKey += 1;
      this.fetch();
    },

    save() {
      let vm = this;
      if (!this.canSave) {
        return false;
      }
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/intelligence/clusters/" + this.clusterId + "/add-orders", {
          erp_order_ids: this.selectedOrderIds,
        })
        .then(() => {
          vm.isSaving = false;
          vm.$message.success("Orders added to cluster successfully");
          vm.$emit("reload");
          vm.$emit("close");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error adding orders to cluster");
        });
    },

    determineSearchParams(params) {
      return {
        results_per_page: 10,
        q: this.searchQuery,
        cluster_id: this.clusterId,
        ...params,
      };
    },

    fetch: _.debounce(function (params = {}) {
      this.loading = true;
      axios
        .post(window.API_BASE + "/intelligence/clusters/search-erp-orders", this.determineSearchParams(params))
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
          this.$message.error("Error searching ERP orders");
        });
    }, 500),

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
  },

  computed: {
    canSave() {
      return this.selectedOrderIds.length > 0;
    },

    rowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          this.selectedOrderIds = selectedRowKeys;
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },
};
</script>

<style scoped lang="scss">
.product-name-wrapper {
  display: flex;
  flex-direction: row;

  .left {
    flex-shrink: 1;
    display: flex;
    align-items: center;
  }

  .right {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
}

.sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  .top {
    flex: 1;
    padding: 5px 20px;
    overflow-y: scroll;
  }

  .bottom {
    flex-shrink: 1;
    background: #fff;
    padding: 15px 20px;
    border-top: 1px solid #e3e8ee;
    text-align: right;

    div {
      float: right;

      span {
        margin-right: 20px;
      }
    }
  }
}
</style>
