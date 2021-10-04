<template>
  <div>
    <a-button type="primary" icon="plus" @click.prevent="showModal">
      New Cluster
    </a-button>
    <a-modal
      :width="700"
      v-model="visible"
      :centered="true"
      title="Create Cluster"
      :footer="null"
    >
      <loading-screen :is-loading="isSaving"></loading-screen>

      <!-- Stage 1: Name -->
      <div v-if="stage === 1">
        <a-form layout="vertical">
          <a-form-item label="Name">
            <a-input
              size="large"
              v-model="clusterName"
              @keyup.enter="goToStageTwo"
            />
          </a-form-item>
        </a-form>
        <div style="text-align: right">
          <a-button
            :disabled="!canGoToStageTwo"
            type="primary"
            @click="goToStageTwo"
            >Next
            <a-icon type="arrow-right" />
          </a-button>
        </div>
      </div>
      <!-- / Stage 1: Name -->

      <!-- Stage 2: Select orders -->
      <div v-if="stage === 2">
        <div style="margin-bottom: 20px; text-align: left">
          <a-input-search
            placeholder="Search ERP orders"
            v-model="searchQuery"
            style="width: 300px"
            @search="fetch"
          />
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
        </a-table>

        <div style="text-align: right; margin-top: 15px">
          <a-button :disabled="!canSave" type="primary" @click="save"
            >Save</a-button
          >
        </div>
      </div>
      <!-- / Stage 2: Select orders -->
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
  name: "CreateClusterButtonAndModal",
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
        results_per_page: 10,
        q: this.searchQuery,
        ...params,
      };
    },

    fetch: _.debounce(function (params = {}) {
      this.loading = true;
      axios
        .post(
          window.API_BASE + "/intelligence/clusters/search-erp-orders",
          this.determineSearchParams(params)
        )
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

<style scoped>
</style>