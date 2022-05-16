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
    <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name }}</a>
    <div slot="type" slot-scope="type">
      {{ formatType(type) }}
    </div>
    <div slot="quantity" slot-scope="quantity">
      <span v-if="quantity">
        {{ quantity }}
      </span>
      <a-badge v-else count="Please provide" :number-style="{ background: '#  ec2c74' }"></a-badge>
    </div>
    <div slot="actions" class="table-actions" slot-scope="actions, record">
      <a-dropdown :trigger="['click']">
        <a-button type="link" icon="ellipsis" @click.prevent="(e) => e.preventDefault()"></a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="#" @click="handleRecordSelected(record)">Edit</a>
          </a-menu-item>
          <a-menu-item>
            <a href="#" @click.prevent="duplicateSpecification(record)">Duplicate</a>
          </a-menu-item>
          <a-menu-item>
            <a href="#" @click.prevent="deleteSpecification(record)" class="text-danger">Delete</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-table>
</template>
<script>
import axios from "axios";
import Dates from "../../mixins/Dates";
import Orders from "../../mixins/Orders";

const columns = [
  {
    title: "Name",
    dataIndex: "product_name",
    sorter: true,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Type",
    dataIndex: "product_type",
    sorter: true,
    scopedSlots: { customRender: "type" },
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    sorter: true,
    scopedSlots: { customRender: "quantity" },
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
];

export default {
  props: ["optimisation", "reloadKey"],
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
    };
  },
  mixins: [Dates, Orders],
  mounted() {
    this.fetch();
  },
  watch: {
    reloadKey() {
      this.fetch();
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
        sort_field: sorter.field,
        sort_order: sorter.order,
        ...filters,
      });
    },

    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisation.id + "/specifications/search", {
          results_per_page: 10,
          ...params,
        })
        .then((r) => {
          const pagination = { ...this.pagination };
          // Read total count from server
          pagination.total = r.data.total;
          this.$emit("set-number-of-specs", r.data.total);
          this.loading = false;
          this.data = r.data.data;
          this.pagination = pagination;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading specifications");
        });
    },

    deleteSpecification(specification) {
      let vm = this;
      vm.isLoading = true;
      axios
        .delete(window.API_BASE + "/optimisations/" + this.optimisation.id + "/specifications/" + specification.id)
        .then(() => {
          vm.isLoading = false;
          this.$message.success("Specification deleted successfully");
          vm.fetch();
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          this.$message.error("Error deleting specification");
        });
    },

    duplicateSpecification(specification) {
      let vm = this;
      vm.isLoading = true;
      axios
        .post(
          window.API_BASE +
            "/optimisations/" +
            this.optimisation.id +
            "/specifications/" +
            specification.id +
            "/duplicate"
        )
        .then(() => {
          vm.isLoading = false;
          this.$message.success("Specification duplicated successfully");
          vm.fetch();
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          this.$message.error("Error duplicating specification");
        });
    },

    handleRecordSelected(spec) {
      this.$emit("selected", spec);
    },
  },
};
</script>
