<template>
  <a-table
    :row-selection="rowSelection"
    :row-class-name="rowClassName"
    :columns="columns"
    :data-source="data"
    :bordered="bordered"
    :pagination="pagination"
    class="rules-table"
  >
    <template slot="image-column" slot-scope="image, record">
      <a-avatar size="large" :src="getImageSrc(record)" />
    </template>
    <template slot="cost-column" slot-scope="cost, record">
      <div v-if="getSavingType(record) === 'Suggested'">
        <span>
          {{
            record.selectedPrice
              ? formatCostInPence2dp({
                  cost: getPriceToShow(record.selectedPrice.price, record.quantity, record.itemType),
                  cost_currency: "USD",
                })
              : "-"
          }}
        </span>
      </div>
      <div v-if="getSavingType(record) === 'Exact'">
        <span>
          {{
            record.selectedPrice
              ? formatCostInPence2dp({
                  cost: record.order.cost,
                  cost_currency: "USD",
                })
              : "-"
          }}
        </span>
      </div>

      <div style="margin-top: 10px" v-if="record.prices && record.selectedPrice">
        <span>{{
          getSavings(record)
            ? formatCostInPence2dp({
                cost: getSavings(record),
                cost_currency: "USD",
              })
            : "-"
        }}</span>
      </div>
    </template>
    <template slot="supplier-column" slot-scope="id, record">
      <span v-if="record.prices && record.selectedPrice">{{ getSupplierName(record) }}</span>
      <span v-else>No suppliers</span>
    </template>
    <template slot="action-column" slot-scope="id">
      <a-button class="mr-2" type="primary" @click="addToBasket(id)">Add to Basket</a-button>
    </template>
  </a-table>
</template>

<script>
const _ = require("lodash");
import Orders from "../../../mixins/Orders";

const columns = [
  {
    title: "",
    dataIndex: "image",
    scopedSlots: { customRender: "image-column" },
    width: 80,
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Cost",
    dataIndex: "cost",
    scopedSlots: { customRender: "cost-column" },
  },
  {
    title: "Product Identifiers",
    dataIndex: "product_identifiers",
  },
  {
    title: "Supplier",
    dataIndex: "supplier",
    scopedSlots: { customRender: "supplier-column" },
  },
  // {
  //   title: '',
  //   align: 'right',
  //   dataIndex: 'id',
  //   scopedSlots: { customRender: "action-column" },
  // }
];
export default {
  name: "ViewListTable",
  props: ["data", "addToBasket"],
  mixins: [Orders],
  components: {},
  data() {
    return {
      columns,
      pagination: false,
      bordered: false,
    };
  },
  methods: {
    getImageSrc(item) {
      if (item["product"] && item["product"]["imageURLs"] && item["product"]["imageURLs"].length) {
        return item["product"]["imageURLs"][0];
      }
      return "/img/icons/basket-order-icon.png";
    },
    rowClassName(record) {
      return record.disabled ? "row-disabled" : "";
    },
    getSupplierName(record) {
      return record.selectedPrice.supplier_name;
    },
    getPriceToShow(price, quantity, itemType) {
      if (itemType === "product") {
        return price * quantity;
      }
      return price;
    },
    getSavingType(row) {
      let prices = _.map(row.prices, "price");
      let benchmarkPrice = _.mean(prices) * 1.3;

      // let savingFromBenchmark = (benchmarkPrice - row.selectedPrice.price);

      if (row.order && row.order.cost) {
        // let savingComparedToBefore = (row.order.cost - row.selectedPrice.price);
        let isSupplierSame = row.order.supplier_id == row.selectedPrice.supplier_id;
        if (row.order.cost < benchmarkPrice && isSupplierSame) {
          return "Exact";
        }
      }

      return "Suggested";
    },

    getSavings(row) {
      let prices = _.map(row.prices, "price");
      let benchmarkPrice = _.mean(prices) * 1.3;

      let savingFromBenchmark = benchmarkPrice - row.selectedPrice.price;

      if (row.order && row.order.cost) {
        let savingComparedToBefore = row.order.cost - row.selectedPrice.price;

        // let isSupplierSame = row.order.supplier_id == row.selectedPrice.supplier_id;
        if (row.order.cost < benchmarkPrice) {
          return savingComparedToBefore;
        }
      }

      if (row.suggestedProducts && row.suggestedProducts.length) {
        let orderedByCost = _.orderBy(row.suggestedProducts, "cost");
        let lowestPrice = _.first(orderedByCost).cost;
        let savingComparedToBefore = lowestPrice - row.selectedPrice.price;
        if (lowestPrice < benchmarkPrice) {
          return savingComparedToBefore * row.quantity;
        }
      }

      return savingFromBenchmark;

      // return (benchmarkPrice - row.selectedPrice.price);
    },
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
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
.rules-table {
  border-top: 1px solid #e8e8e8;
}

.badge {
  padding: 0 8px;
  display: inline-block;
  border-radius: 100px;
  background-color: rgb(245, 245, 250);
  color: rgb(72, 76, 122);
  border: 1px solid rgb(214, 214, 231);
}

.colored-badge {
  padding: 0 8px;
  display: inline-block;
  border-radius: 100px;
  background-color: rgb(232, 250, 255);
  color: rgb(0, 118, 155);
  border: 1px solid rgb(185, 239, 255);
}

.cond-wrapper {
  margin: 8px 8px 0 0;
}

.subtext {
  color: #5a5e9a;
  font-size: 12px;
}

.category-wrapper {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
}

.pin-image {
  width: 14px;
  height: 14px;
  border: 1px solid rgb(182, 183, 213);
  border-radius: 3px;
  margin-top: -1px;
}

.dropdown-item {
  width: 250px;
  padding: 8px 12px;
  align-items: center;
}

.dropdown-item-between {
  width: 250px;
  padding: 8px 12px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
