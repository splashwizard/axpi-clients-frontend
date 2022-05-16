<template>
  <div>
    <a-tabs v-model="statusToShow">
      <a-tab-pane :key="null" tab="All"></a-tab-pane>
      <a-tab-pane :key="0" tab="Open"></a-tab-pane>
      <a-tab-pane :key="1" tab="Closed"></a-tab-pane>
    </a-tabs>

    <a-table
      class="axpi-table"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name }}</a>
      <div slot="status" slot-scope="status">
        <a-badge :count="getHumanReadableStatus(status)" :number-style="getStatusBadgeStyle(status)"></a-badge>
      </div>
      <div slot="numberOfOrders" slot-scope="numberOfOrders">
        {{ numberOfOrders }}
      </div>
      <div slot="spend" slot-scope="spend">£1,000,000 {{ spend }}</div>
    </a-table>
  </div>
</template>

<script>
import Dates from "../../../mixins/Dates";
import axios from "axios";

const _ = require("lodash");

const columns = [
  {
    title: "Name",
    dataIndex: "name",
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
    title: "Orders",
    dataIndex: "numberOfOrders",
    sorter: true,
    scopedSlots: { customRender: "numberOfOrders" },
  },
  {
    title: "Spend",
    dataIndex: "spend",
    sorter: true,
    scopedSlots: { customRender: "spend" },
  },
];

export default {
  name: "ProjectsTable",
  props: ["reloadKey"],
  data() {
    return {
      statusToShow: null,
      data: [],
      pagination: {},
      loading: false,
      filters: {
        filters_enabled: [],
      },
      columns,
    };
  },
  mixins: [Dates],
  mounted() {
    this.fetch();
  },
  watch: {
    statusToShow() {
      this.fetch();
    },
    reloadKey() {
      this.fetch();
    },
  },
  methods: {
    handleRecordSelected(project) {
      // this.$emit('selected', order);
      this.$router.push("/projects/" + project.id);
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
        status: this.statusToShow,
      };

      if (this.filters && this.filters.filters_enabled.length) {
        search.filters = {};
        _.each(this.filters.filters_enabled, (filter) => {
          search.filters[filter] = this.filters[filter];
        });
      }

      return {
        ...search,
        ...params,
      };
    },

    fetch: _.debounce(function (params = {}) {
      this.loading = true;
      axios
        .post(window.API_BASE + "/projects/search", this.determineSearchParams(params))
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
          this.$message.error("Error loading projects");
        });
    }, 500),

    getHumanReadableStatus(status) {
      if (status === 1) {
        return "Complete";
      }
      return "Ongoing";
    },

    getStatusBadgeStyle(status) {
      return {
        backgroundColor: this.getStatusColor(status),
      };
    },

    getStatusColor(status) {
      if (status === 1) {
        return "#46b98e";
      }
      return "#4dc8f2";
    },
  },
};
</script>

<style scoped></style>
