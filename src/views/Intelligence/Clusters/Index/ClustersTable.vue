<template>
  <a-table
    class="axpi-table"
    :columns="columns"
    :row-key="(record) => record.id"
    :data-source="dataToShow"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name }}</a>

    <div slot="numberOfItems" slot-scope="actions, record">
      {{ record["erp_order_ids"] ? record["erp_order_ids"].length : "-" }}
    </div>

    <div slot="potentialSavings" slot-scope="potentialSavings, record">
      {{ formatCost({ cost: calculatePotentialSavings(record), cost_currency: "USD" }) }}
    </div>

    <div slot="actions" class="table-actions" slot-scope="actions, record">
      <a-dropdown :trigger="['click']">
        <a-button type="link" icon="ellipsis" @click.prevent="(e) => e.preventDefault()"></a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="#" class="text-danger" @click.prevent="deleteCluster(record)">Delete</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-table>
</template>
<script>
import axios from "axios";
import Orders from "../../../../mixins/Orders";

const _ = require("lodash");

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Number of Items",
    scopedSlots: { customRender: "numberOfItems" },
  },
  {
    title: "Potential Savings",
    dataIndex: "potential_savings",
    scopedSlots: { customRender: "potentialSavings" },
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
];

export default {
  props: ["reloadKey", "insightTypeFilter"],
  mixins: [Orders],
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
  watch: {
    reloadKey() {
      this.fetch();
    },
  },
  computed: {
    dataToShow() {
      if (this.insightTypeFilter) {
        return _.filter(this.data, (d) => {
          let pricingInsights = _.filter(d["insights"], {
            insight_type: this.insightTypeFilter,
          });
          let potentialSavings = _.sum(_.map(pricingInsights, "potential_savings"));
          return potentialSavings > 0;
        });
      }
      return this.data;
    },
  },
  methods: {
    handleRecordSelected(cluster) {
      this.$router.push("/intelligence/clusters/" + cluster["_id"]);
    },

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
        .post(window.API_BASE + "/intelligence/clusters/search", {
          results_per_page: 100,
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
          this.$message.error("Error loading clusters");
        });
    },

    deleteCluster(cluster) {
      this.$emit("delete-cluster", cluster);
    },

    calculatePotentialSavings(record) {
      console.log(record);
      let insights = record["insights"];
      let groupedByErpOrderId = _.groupBy(insights, "erp_order_id");

      let potentialSavings = 0;
      _.each(groupedByErpOrderId, (insightsForErpOrder) => {
        potentialSavings += _.max(_.map(insightsForErpOrder, "potential_savings"));
      });

      return potentialSavings;
    },
  },
};
</script>
