<template>
  <div>
    <h2>Scenarios</h2>

    <div class="table-wrapper">
      <a-table class="axpi-table" :data-source="scenarios" :pagination="false" :columns="columns">
        <div slot="expectedCost" slot-scope="cost">
          {{ formatCostInPence2dp({ cost: cost, cost_currency: "USD" }) }}
        </div>

        <div slot="co2e" slot-scope="co2e">
          <span v-if="co2e">{{ formatCo2e(co2e) }} kg</span>
          <span v-else>Unknown</span>
        </div>

        <div slot="itemsAllocated" slot-scope="itemsAllocated">
          <div class="bullet-chart">
            <div class="left">
              <a-progress :percent="(itemsAllocated / basket.length) * 100" :show-info="false" />
            </div>
            <div class="right">{{ itemsAllocated }}/{{ basket.length }}</div>
          </div>
        </div>

        <div slot="actions" slot-scope="actions, row">
          <div class="actions">
            <a-button @click.prevent="() => optimise(row.minimise)">Select</a-button>
          </div>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
const _ = require("lodash");
import Orders from "../../../mixins/Orders";
import { mapGetters, mapActions } from "vuex";

const columns = [
  {
    title: "Scenario",
    dataIndex: "name",
  },
  {
    title: "Expected Cost",
    dataIndex: "expectedCost",
    scopedSlots: { customRender: "expectedCost" },
  },
  {
    title: "CO2e",
    dataIndex: "co2e",
    scopedSlots: { customRender: "co2e" },
  },
  {
    dataIndex: "itemsAllocated",
    title: "Items Allocated",
    key: "itemsAllocated",
    scopedSlots: { customRender: "itemsAllocated" },
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
  },
];

export default {
  name: "OptimiseWrapper",
  mixins: [Orders],
  data() {
    return {
      columns,
    };
  },
  methods: {
    ...mapActions("shop", {
      setBasket: "setBasket",
    }),

    formatCo2e(val) {
      return Math.round(val * 100) / 100;
    },

    optimise(fieldToMinimise) {
      if (fieldToMinimise === "cost") {
        this.setBasket(
          _.map(this.basket, (item) => {
            return {
              ...item,
              selectedPrice: _.first(_.orderBy(item.prices, "price")),
            };
          })
        );
      }
      if (fieldToMinimise === "co2e") {
        this.setBasket(
          _.map(this.basket, (item) => {
            return {
              ...item,
              selectedPrice: _.first(_.orderBy(item.prices, "co2e")),
            };
          })
        );
      }
    },
  },
  computed: {
    ...mapGetters("shop", {
      basket: "basket",
    }),

    itemData() {
      return _.map(this.basket, (item) => {
        if (item.itemType == "product") {
          return _.map(item.prices, (price) => ({
            price: price.price * item.quantity,
            co2e: price.co2e * item.quantity,
          }));
        }
        return item.prices;
      });
    },

    minPricesScenario() {
      return _.map(this.itemData, (prices) => {
        let orderedByPrice = _.orderBy(prices, "price");
        return _.first(orderedByPrice);
      });
    },

    minPricesScenarioPrices() {
      let prices = _.map(this.minPricesScenario, "price");
      return _.filter(prices, (p) => p);
    },

    minPricesScenarioCo2es() {
      let prices = _.map(this.minPricesScenario, "co2e");
      return _.filter(prices, (p) => p);
    },

    minCo2esScenario() {
      return _.map(this.itemData, (prices) => {
        let orderedByCo2e = _.orderBy(prices, "co2e");
        return _.first(orderedByCo2e);
      });
    },

    minCo2esScenarioPrices() {
      let prices = _.map(this.minCo2esScenario, "price");
      return _.filter(prices, (p) => p);
    },

    minCo2esScenarioCo2es() {
      let prices = _.map(this.minCo2esScenario, "co2e");
      return _.filter(prices, (p) => p);
    },

    scenarios() {
      return [
        {
          name: "Best Price",
          minimise: "cost",
          expectedCost: _.sum(this.minPricesScenarioPrices),
          co2e: _.sum(this.minPricesScenarioCo2es),
          itemsAllocated: this.minPricesScenarioPrices.length,
        },
        {
          name: "Environmentally Friendly",
          minimise: "co2e",
          expectedCost: _.sum(this.minCo2esScenarioPrices),
          co2e: _.sum(this.minCo2esScenarioCo2es),
          itemsAllocated: this.minCo2esScenarioCo2es.length,
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.actions {
  text-align: right;
}

.bullet-chart {
  display: flex;

  .left {
    flex: 1;
  }

  .right {
    padding-left: 20px;
    flex-shrink: 1;
  }
}
</style>
