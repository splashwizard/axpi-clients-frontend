<template>
  <a-table
    class="axpi-table"
    :columns="columns"
    :row-key="(record) => record.id"
    :data-source="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <div slot="created_at" slot-scope="created_at">
      {{ created_at ? formatDate(created_at) : null }}
    </div>
  </a-table>
</template>
<script>
import axios from "axios";
import Dates from "../../mixins/Dates";

const columns = [
  {
    title: "Invited On",
    dataIndex: "created_at",
    sorter: true,
    scopedSlots: { customRender: "created_at" },
  },
  {
    title: "Company Name",
    dataIndex: "company_name",
    sorter: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: true,
  },
];

export default {
  mixins: [Dates],
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
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

    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;
      axios
        .post(window.API_BASE + "/supplier-invites", {
          results_per_page: 10,
          ...params,
        })
        .then((r) => {
          const pagination = { ...this.pagination };
          // Read total count from server
          pagination.total = r.data.total;
          this.loading = false;
          this.data = r.data.data;
          this.pagination = pagination;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading supplier invites");
        });
    },
  },
};
</script>
