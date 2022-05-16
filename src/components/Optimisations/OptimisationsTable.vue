<template>
  <div>
    <loading-screen :is-loading="isDeleting"></loading-screen>
    <a-table
      class="axpi-table"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="name" slot-scope="text, record">
        <router-link :to="getOptimisationLink(record)">
          {{ text }}
        </router-link>
      </template>
      <template slot="expectedCost" slot-scope="expectedCost, optimisation">
        <div v-if="optimisation.min_expected_cost">
          {{ formatCost({ cost: optimisation.min_expected_cost / 100, cost_currency: "USD" }) }}
          <span v-if="optimisation.max_expected_cost">
            - {{ formatCost({ cost: optimisation.max_expected_cost / 100, cost_currency: "USD" }) }}</span
          >
        </div>
        <div v-else>-</div>
      </template>
      <template slot="co2e" slot-scope="co2e, optimisation">
        <div v-if="optimisation.min_co2e">
          {{ optimisation.min_co2e }}kg
          <span v-if="optimisation.max_co2e"> - {{ optimisation.max_co2e }}kg</span>
        </div>
        <div v-else>-</div>
      </template>
      <template slot="created-at" slot-scope="text">
        {{ formatDate(text) }}
      </template>
      A
      <template slot="actions" class="table-actions" slot-scope="actions, record">
        <a-dropdown :trigger="['click']">
          <a-button type="link" icon="ellipsis" @click.prevent="(e) => e.preventDefault()"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <router-link :to="getOptimisationLink(record)"> Edit </router-link>
            </a-menu-item>
            <a-menu-item>
              <a href="#" @click.prevent="deleteOptimisation(record)" class="text-danger">Delete</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </a-table>
  </div>
</template>
<script>
import axios from "axios";
import Dates from "../../mixins/Dates";
import Orders from "../../mixins/Orders";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    scopedSlots: {
      customRender: "name",
    },
  },
  {
    title: "Scenarios",
    dataIndex: "optimisation_scenario_count",
    sorter: true,
  },
  {
    title: "Items",
    dataIndex: "optimisation_specification_count",
    sorter: true,
  },
  {
    title: "Expected Cost",
    dataIndex: "expectedCost",
    sorter: true,
    scopedSlots: {
      customRender: "expectedCost",
    },
  },
  {
    title: "CO2e",
    dataIndex: "co2e",
    sorter: true,
    scopedSlots: {
      customRender: "co2e",
    },
  },
  {
    title: "Date Created",
    dataIndex: "created_at",
    sorter: true,
    scopedSlots: {
      customRender: "created-at",
    },
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
];

export default {
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
      isDeleting: false,
    };
  },
  mixins: [Dates, Orders],
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
        .post(window.API_BASE + "/optimisations/search", {
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
          this.$message.error("Error loading optimisations");
        });
    },

    getOptimisationLink(optimisation) {
      return "/optimisations/" + optimisation.id;
    },

    deleteOptimisation(optimisation) {
      let vm = this;
      vm.isDeleting = true;
      axios
        .delete(window.API_BASE + "/optimisations/" + optimisation.id)
        .then(() => {
          vm.isDeleting = false;
          this.$message.success("Optimisation deleted successfully");
          vm.fetch();
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          this.$message.error("Error deleting optimisation");
        });
    },
  },
};
</script>
