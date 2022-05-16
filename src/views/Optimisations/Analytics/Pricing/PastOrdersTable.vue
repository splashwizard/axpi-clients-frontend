<template>
  <div>
    <a-table :columns="columns" :data-source="data" class="axpi-table">
      <span slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name }}</span>
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
      <!--      <div slot="updated_at" slot-scope="updated_at">-->
      <!--        {{ displayTimeAgo(updated_at) }}-->
      <!--      </div>-->
    </a-table>
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../../../mixins/Orders";
import Dates from "../../../../mixins/Dates";

let _ = require("lodash");

const columns = [
  {
    title: "Supplier",
    dataIndex: "supplier.name",
    sorter: true,
  },
  {
    title: "Order Name",
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
    title: "Order Date",
    dataIndex: "order_date",
    sorter: true,
    scopedSlots: { customRender: "order_date" },
  },
];

export default {
  name: "PastOrdersTable",
  props: ["optimisation"],
  mixins: [Orders, Dates],
  data() {
    return {
      isLoading: false,
      data: [],
      columns,
      optimisationSpecifications: [],
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/optimisations/" + vm.optimisation.id + "/specifications")
        .then((r) => {
          vm.optimisationSpecifications = r.data;
          vm.fetchPastOrders();
        })
        .catch((e) => {
          vm.isLoading = false;
          vm.$message.error("Error loading optimisation specifications");
          console.log(e);
        });
    },

    fetchPastOrders() {
      let vm = this;
      vm.data = null;
      vm.isLoading = true;

      let requests = [];
      _.each(vm.optimisationSpecifications, (optimisationSpecification) => {
        requests.push(
          axios.post(window.API_BASE + "/orders/match-to-optimisation-specification", {
            optimisation_id: vm.optimisation.id,
            optimisation_specification_id: optimisationSpecification.id,
          })
        );
      });

      let data = [];
      axios
        .all(requests)
        .then(
          axios.spread((...responses) => {
            _.each(responses, (r) => {
              data.push(r.data);
            });
            vm.isLoading = false;
            vm.data = _.flatten(data);
          })
        )
        .catch((errors) => {
          vm.isLoading = false;
          _.each(errors, (e) => {
            console.log(e);
          });
          vm.$message.error("Error loading past orders");
        });
    },

    getStatusBadgeStyle(status) {
      return {
        backgroundColor: this.getStatusColor(status),
      };
    },
  },
};
</script>

<style scoped></style>
