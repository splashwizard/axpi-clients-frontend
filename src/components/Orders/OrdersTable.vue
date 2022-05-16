<template>
  <div>
    <a-tabs v-model="statusToShow">
      <a-tab-pane :key="null" tab="All"></a-tab-pane>
      <a-tab-pane :key="0" tab="Incomplete"></a-tab-pane>
      <a-tab-pane :key="1" tab="Ready To Send"></a-tab-pane>
      <a-tab-pane :key="2" tab="Sent"></a-tab-pane>
      <a-tab-pane :key="3" tab="Rejected"></a-tab-pane>
      <a-tab-pane :key="4" tab="Completed"></a-tab-pane>
    </a-tabs>

    <a-table
      class="axpi-table"
      :row-selection="rowSelection"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading || searchQueryIsDirty"
      @change="handleTableChange"
    >
      <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name }}</a>
      <div slot="status" slot-scope="status">
        <a-badge :count="getHumanReadableStatus(status)" :number-style="getStatusBadgeStyle(status)"></a-badge>
      </div>
      <div slot="type" slot-scope="type">
        {{ formatType(type) }}
      </div>
      <div slot="cost" slot-scope="cost, order">
        {{ formatCostInPence(order) }}
      </div>
      <div slot="order_date" slot-scope="order_date">
        {{ order_date ? formatDate(order_date) : null }}
      </div>
      <div slot="updated_at" slot-scope="updated_at">
        {{ displayTimeAgo(updated_at) }}
      </div>
      <div slot="actions" class="table-actions" slot-scope="actions, record">
        <a-dropdown :trigger="['click']">
          <a-button type="link" icon="ellipsis" @click.prevent="(e) => e.preventDefault()"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" @click="editOrder(record)">Edit</a>
            </a-menu-item>
            <a-menu-item>
              <a href="#" class="text-danger" @click.prevent="deleteRecord(record)">Delete</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-table>
  </div>
</template>
<script>
import axios from "axios";
import Orders from "../../mixins/Orders";
import Dates from "../../mixins/Dates";

const _ = require("lodash");

const columns = [
  {
    title: "Name",
    dataIndex: "product_name",
    sorter: true,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: true,
    scopedSlots: { customRender: "status" },
  },
  {
    title: "Type",
    dataIndex: "product_type",
    sorter: true,
    scopedSlots: { customRender: "type" },
  },
  {
    title: "Cost",
    dataIndex: "cost",
    sorter: true,
    scopedSlots: { customRender: "cost" },
  },
  {
    title: "Supplier",
    dataIndex: "supplier.name",
    sorter: true,
  },
  {
    title: "Order Date",
    dataIndex: "order_date",
    sorter: true,
    scopedSlots: { customRender: "order_date" },
  },
  {
    title: "Last Updated",
    dataIndex: "updated_at",
    sorter: true,
    scopedSlots: { customRender: "updated_at" },
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
];

export default {
  props: ["reloadKey", "searchQuery", "filters"],
  data() {
    return {
      data: [],
      pagination: {},
      searchQueryIsDirty: false,
      loading: false,
      statusToShow: null,
      columns,
      selectedOrderIds: [],
    };
  },
  mixins: [Orders, Dates],
  mounted() {
    this.fetch();
  },
  watch: {
    statusToShow() {
      // this.selectedOrderIds = [];
      this.fetch();
    },
    reloadKey() {
      this.fetch();
    },
    selectedOrderIds(newSelection) {
      this.$emit("set-selected-order-ids", newSelection);
    },
    searchQuery: function () {
      this.searchQueryIsDirty = true;
      this.fetch();
    },
  },
  computed: {
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
  methods: {
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
        status: this.statusToShow,
        q: this.searchQuery,
      };

      if (this.filters && this.filters.filters_enabled.length) {
        search.filters = {};
        _.each(this.filters.filters_enabled, (filter) => {
          search.filters[filter] = this.filters[filter];
        });
      }

      console.log(search);

      return {
        ...search,
        ...params,
      };
    },

    fetch: _.debounce(function (params = {}) {
      this.loading = true;
      axios
        .post(window.API_BASE + "/orders/search", this.determineSearchParams(params))
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
      // this.$emit('selected', order);
      this.$router.push("/orders/" + order.id);
    },

    editOrder(order) {
      this.$emit("selected", order);
    },

    deleteRecord(order) {
      this.$emit("delete-order", order);
    },

    getStatusBadgeStyle(status) {
      return {
        backgroundColor: this.getStatusColor(status),
      };
    },

    // getInformationRequestUrl(informationRequest) {
    //    return '/information-requests/' + informationRequest.id + '/edit';
    // }
  },
};
</script>
