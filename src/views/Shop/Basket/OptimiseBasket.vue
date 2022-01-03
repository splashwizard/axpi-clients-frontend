<template>
  <div>
    <h2>Scenarios</h2>

    <div class="table-wrapper">
      <a-table class="axpi-table"
               :data-source="scenarios"
               :pagination="false"
               :columns="columns">

        <div slot="expectedCost" slot-scope="cost">
          {{ formatCostInPence2dp({cost: cost, cost_currency: 'USD'}) }}
        </div>

        <div slot="co2e">
          -
        </div>

        <div slot="actions" slot-scope="actions,row">
          <div class="actions">
            <a-button @click.prevent="() => optimise(row.minimise)">Select</a-button>
          </div>
        </div>

      </a-table>
    </div>
  </div>
</template>

<script>
const _ = require('lodash');
import Orders from "../../../mixins/Orders";
import {mapGetters, mapActions} from 'vuex';

const columns = [
  {
    title: 'Scenario',
    dataIndex: 'name'
  },
  {
    title: 'Expected Cost',
    dataIndex: 'expectedCost',
    scopedSlots: {customRender: 'expectedCost'}
  },
  {
    title: 'CO2e',
    dataIndex: 'co2e',
    scopedSlots: {customRender: 'co2e'}
  },
  {
    title: '',
    scopedSlots: {customRender: 'actions'}
  }
];

export default {
  name: "OptimiseWrapper",
  mixins: [Orders],
  data() {
    return {
      columns
    }
  },
  methods: {
    ...mapActions('shop', {
      setBasket: 'setBasket'
    }),

    optimise(fieldToMinimise) {
      if (fieldToMinimise === 'cost') {
        this.setBasket(_.map(this.basket, item => {
          return {
            ...item,
            selectedPrice: _.first(_.orderBy(item.prices, 'price'))
          }
        }));
      }
    }
  },
  computed: {
    ...mapGetters('shop', {
      basket: 'basket'
    }),

    scenarios() {
      let minPricesMultipliedByQuantities = _.map(this.basket, item => {
        let prices = _.map(item.prices, 'price');
        let minPriceForProduct = _.min(prices);
        return minPriceForProduct * item.quantity;
      });
      minPricesMultipliedByQuantities = _.filter(minPricesMultipliedByQuantities, p => p);

      let co2es = _.map(this.basket, item => {
        if (item.itemType == 'product') {
          return item.co2e && item.quantity;
        }
        return item.co2e;
      });
      co2es = _.filter(co2es, c => c);

      return [
        {
          name: 'Best Price',
          minimise: 'cost',
          expectedCost: _.sum(minPricesMultipliedByQuantities),
          co2e: _.sum(co2es)
        },
        {
          name: 'Environmentally Friendly',
          minimise: 'cost',
          expectedCost: _.sum(minPricesMultipliedByQuantities),
          co2e: _.sum(co2es)
        }
      ];
    }
  }
}
</script>

<style scoped lang="scss">
.actions {
  text-align: right;
}
</style>