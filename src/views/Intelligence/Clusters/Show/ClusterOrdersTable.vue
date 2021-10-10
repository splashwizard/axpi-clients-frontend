<template>
  <a-table
    class="axpi-table"
    :columns="columns"
    :row-key="(record) => record.id"
    :data-source="data"
    :loading="loading"
  >
    <div slot="name" slot-scope="name, record"> 
      <a-avatar style="margin-right: 20px;"
       size="large" :src="getImageSrc(getFirstProduct(record))" />
       {{ getFirstProduct(record) ? getFirstProduct(record)['Name'] : name }}
    </div>
    <div slot="productCode" slot-scope="name, record">
      {{ getFirstProduct(record) ? getFirstProduct(record)['Product_Code'] : '-' }}
    </div>
    <div slot="quantity" slot-scope="quantity, order">
     {{ getQuantity(order) }}
    </div>
    <div slot="cost" slot-scope="cost">
        {{ formatCost({cost: cost, cost_currency: 'USD'}) }}
    </div>
    <div slot="insights" slot-scope="insights, record">
      <a href="#" @click.prevent="handleRecordSelected(record)">
        <a-icon type="eye" style="margin-right: 4px;" /> View
      </a>
    </div>
    <div slot="actions" class="table-actions" slot-scope="actions, record">
      <a-dropdown :trigger="['click']">
        <a-button
          type="link"
          icon="ellipsis"
          @click.prevent="(e) => e.preventDefault()"
        ></a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a
              href="#"
              class="text-danger"
              @click.prevent="deleteRecord(record)"
              >Remove</a
            >
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-table>
</template>
<script>
import axios from "axios";
import Orders from "../../../../mixins/Orders";

const columns = [
  {
    title: "Name",
    dataIndex: "PO Li Description",
    sorter: true,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: "PO Number",
    dataIndex: "PO Number"
  },
  // {
  //   title: "Product Code",
  //   scopedSlots: {customRender: 'productCode'}
  // },
  {
    title: "Year Purchased",
    dataIndex: "PO Creation Year",
    // scopedSlots: {customRender: 'productCode'}
  },
  {
    title: "Quantity",
    dataIndex: "Quantity",
    scopedSlots: {customRender: 'quantity'}
  },
  {
    title: "Cost",
    dataIndex: "Cost",
    scopedSlots: {customRender: 'cost'}
  },
  // {
  //   title: "PO Number",
  //   dataIndex: "PO Number",
  //   sorter: true,
  // },
  {
    title: "Insights",
    scopedSlots: {customRender: 'insights'}
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
];

export default {
  props: ["clusterId"],
  mixins: [Orders],
  data() {
    return {
      data: [],
      loading: false,
      columns,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;
      axios
        .get(
          window.API_BASE +
            "/intelligence/clusters/" +
            this.clusterId +
            "/orders-with-matches"
        )
        .then((r) => {
          this.loading = false;
          this.data = r.data;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading orders");
        });
    },

    deleteRecord(order) {
      this.$emit("remove-order", order);
    },

    handleRecordSelected(record) {
      this.$emit('record-selected', record);
    },

    getFirstProduct(record) {
      return record["products"][0];
    },

    getImageSrc(product) {
      if (product["Images"] && product["Images"].length) {
        return product["Images"][0];
      }
    },

    getQuantity(order) {
      if (order["products"] && order["products"].length) {
        if (order["products"][0]["normalisedQuantity"]) {
          order['product_quantity'] = order['products'][0]['normalisedQuantity']['normalisedUnitMagnitude'];
        }
      }

      let orderQuantity = order["Quantity"] !== "None" ? order["Quantity"] : 1;
      let totalQuantity = orderQuantity;
      if (order['product_quantity']) {
        totalQuantity = Number(orderQuantity) * Number(order['product_quantity']);
      }

      return totalQuantity;
    }
  },
};
</script>
