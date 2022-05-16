<template>
  <div style="padding-top: 15px">
    <table class="axpi-basic-table">
      <thead>
        <tr>
          <th width="200">Supplier</th>
          <th width="100">Price</th>
          <th>Availability</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(price, i) in pricesWithStocks" :key="i">
          <td>{{ price.supplier_name }}</td>
          <td>
            {{
              price
                ? formatCostInPence2dp({
                    cost: price.price,
                    cost_currency: "USD",
                  })
                : "-"
            }}
          </td>
          <td class="stock-cell">
            <a-icon v-if="isInStock(price.stock)" type="check-circle" theme="twoTone" two-tone-color="#52c41a"></a-icon>
            <a-icon
              v-if="isOutOfStock(price.stock)"
              type="close-circle"
              theme="twoTone"
              two-tone-color="#FF0000"
            ></a-icon>
            <span class="availability-text">{{ getStockText(price.stock) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Orders from "../../../mixins/Orders";
import StockManagement from "../../../mixins/StockManagement";

const _ = require("lodash");

export default {
  name: "PricingTab",
  props: ["prices", "stocks"],
  mixins: [Orders, StockManagement],
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    pricesWithStocks() {
      return _.map(this.prices, (price) => ({
        ...price,
        stock: this.getStockForSupplier(price.supplier_id),
      }));
    },
  },
  methods: {
    getStockForSupplier(supplierId) {
      let stock = _.find(this.stocks, { supplier_id: supplierId });
      return stock !== undefined ? stock.stock : null;
    },
  },
};
</script>

<style scoped lang="scss">
.stock-cell {
  .anticon {
    margin-right: 10px;
  }
}
</style>
