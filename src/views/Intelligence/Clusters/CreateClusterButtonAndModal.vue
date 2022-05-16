<template>
  <div>
    <a-button type="primary" icon="plus" @click.prevent="showModal"> New Cluster </a-button>
    <a-modal :width="850" v-model="visible" :centered="true" title="Create Cluster" :footer="null">
      <loading-screen :is-loading="isSaving"></loading-screen>

      <!-- Stage 1: Name -->
      <div v-if="stage === 1">
        <a-form layout="vertical">
          <a-form-item label="Name">
            <a-input size="large" v-model="clusterName" @keyup.enter="goToStageTwo" />
          </a-form-item>
        </a-form>
        <div style="text-align: right">
          <a-button :disabled="!canGoToStageTwo" type="primary" @click="goToStageTwo"
            >Next
            <a-icon type="arrow-right" />
          </a-button>
        </div>
      </div>
      <!-- / Stage 1: Name -->

      <!-- Stage 2: Select orders -->
      <div v-if="stage === 2">
        <div style="margin-bottom: 20px; text-align: left">
          <a-input-search placeholder="Search orders" v-model="searchQuery" style="width: 300px" @search="fetch" />
        </div>

        <a-table
          class="axpi-table"
          :columns="columns"
          :row-selection="rowSelection"
          :row-key="(record) => record['_id']"
          :data-source="data"
          :pagination="pagination"
          :loading="loading || searchQueryIsDirty"
          @change="handleTableChange"
        >
          <div slot="cost" slot-scope="cost">
            {{ formatCost({ cost: cost, cost_currency: "USD" }) }}
          </div>
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
          <div slot="productCode" slot-scope="productCode, order">
            {{ order["match_details_product_codes"][0] }}
          </div>
        </a-table>

        <div style="text-align: right; margin-top: 15px">
          <a-button :disabled="!canSave" type="primary" @click="save">Save </a-button>
        </div>
      </div>
      <!-- / Stage 2: Select orders -->
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../../mixins/Orders";

const _ = require("lodash");

const columns = [
  {
    title: "Name",
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
  {
    title: "Product Code",
    // dataIndex: "Cost",
    dataIndex: "productCode",
    scopedSlots: { customRender: "productCode" },
    sorter: true,
    width: 150,
  },
];

export default {
  name: "CreateClusterButtonAndModal",
  mixins: [Orders],
  data() {
    return {
      visible: false,
      clusterName: "",
      stage: 1,

      isSaving: false,
      serverErrors: [],

      loading: false,
      data: [],
      pagination: {},
      searchQuery: "",
      searchQueryIsDirty: false,
      selectedOrderIds: [],

      columns,
    };
  },
  watch: {
    searchQuery: function () {
      this.searchQueryIsDirty = true;
      this.fetch();
    },
  },
  methods: {
    showModal() {
      this.visible = true;
      this.clusterName = "";
      this.selectedOrderIds = [];
      this.stage = 1;
      this.data = [];
      this.pagination = {};
      this.searchQueryIsDirty = false;
      this.selectedOrderIds = [];
    },

    goToStageTwo() {
      if (!this.canGoToStageTwo) {
        return false;
      }
      this.stage = 2;
      this.fetch();
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/intelligence/clusters", {
          name: this.clusterName,
          erp_order_ids: this.selectedOrderIds,
        })
        .then((r) => {
          vm.visible = false;
          vm.isSaving = false;
          vm.$router.push("/intelligence/clusters/" + r.data["_id"]);
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error creating cluster");
        });
    },

    determineSearchParams(params) {
      return {
        results_per_page: 5,
        q: this.searchQuery,
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
        // results_per_page: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
  },
  computed: {
    canGoToStageTwo() {
      return this.clusterName.length > 0;
    },

    canSave() {
      return this.selectedOrderIds.length > 0;
      // return true;
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
</style>
