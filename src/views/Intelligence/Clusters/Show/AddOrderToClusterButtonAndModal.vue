<template>
  <div>
    <a-button type="primary" icon="plus" @click.prevent="showModal">Add Orders To Cluster</a-button>
    <a-modal :width="700" v-model="visible" :centered="true" title="Add Orders To Cluster" :footer="null">
      <loading-screen :is-loading="isSaving"></loading-screen>

      <!-- Orders table -->
      <div>
        <div style="margin-bottom: 20px; text-align: left">
          <a-input-search placeholder="Search ERP orders" v-model="searchQuery" style="width: 300px" @search="fetch" />
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
        </a-table>

        <div style="text-align: right; margin-top: 15px">
          <a-button :disabled="!canSave" type="primary" @click="save">Add to cluster</a-button>
        </div>
      </div>
      <!-- / Orders table -->
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
const _ = require("lodash");

const columns = [
  {
    title: "Name",
    dataIndex: "PO Li Description",
    sorter: true,
  },
  {
    title: "PO Number",
    dataIndex: "PO Number",
    sorter: true,
  },
];

export default {
  name: "AddOrderToClusterButtonAndModal",
  props: ["clusterId"],
  data() {
    return {
      visible: false,

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
  methods: {
    showModal() {
      this.visible = true;
      this.data = [];
      this.pagination = {};
      this.searchQueryIsDirty = false;
      this.selectedOrderIds = [];

      this.reloadKey += 1;
      this.fetch();
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/intelligence/clusters/" + this.clusterId + "/add-orders", {
          erp_order_ids: this.selectedOrderIds,
        })
        .then(() => {
          vm.visible = false;
          vm.isSaving = false;
          vm.$message.success("Orders added to cluster successfully");
          vm.$emit("reload");
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
        sort_field: sorter.field,
        sort_order: sorter.order,
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

<style></style>
