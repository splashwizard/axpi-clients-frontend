<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="innerRows"
      :pagination="false"
      :show-header="false"
      class="basketRowInnerTable"
      :expandIconAsCell="false"
      :expand-icon="getExpandIcon"
      :expand-icon-column-index="4"
    >
      <div slot="icon" slot-scope="icon">
        <a-icon class="rowIcon" :type="icon" theme="twoTone" />
      </div>

      <div slot="name" slot-scope="name">
        <span class="name">{{ name }}</span>
      </div>

      <div slot="summary" slot-scope="summary, record">
        <div class="summary-column">
          <div v-if="record.title == 'Suggested Prices'">
            <span style="margin-right: 5px">
              {{ suggestedPriceRange }}
            </span>
            <!--            <a-tag color="blue" style="margin-right: 0;">Suggested</a-tag>-->
          </div>

          <div v-if="record.title == 'Similar Products'">
            <span v-if="row.itemType == 'order'">
              {{ suggestedPriceRangeForOrder }}
            </span>
            <span v-if="row.itemType == 'product'">
              {{ suggestedPriceRangeForSimilarProducts }}
            </span>

            <!--            <a-progress type="circle"-->
            <!--                        :width="30"-->
            <!--                        style="margin-left: 15px"-->
            <!--                        :percent="100"/>-->

            <!--          <span style="margin-left: 10px;">100% match</span>-->
            <!--          <span></span>-->
          </div>

          <div v-if="record.title == 'Savings Summary'">
            <span style="margin-right: 5px">
              {{ savingsRange }}
            </span>
            <!--          <a-tag color="blue">Suggested</a-tag>-->
          </div>
        </div>
      </div>

      <div slot="summary-tags" slot-scope="summary, record">
        <div v-if="record.title == 'Suggested Prices'">
          <a-tag v-if="row.itemType !== 'product'" color="blue" style="margin-right: 0">Suggested</a-tag>
        </div>
        <div v-if="record.title == 'Similar Products'">
          <a-progress type="circle" v-if="row.itemType !== 'product'" :width="30" :percent="100" />
        </div>
      </div>

      <div slot="additional_summary" slot-scope="summary, record">
        <div v-if="record.title == 'Suggested Prices'">
          <span style="margin-right: 5px">
            {{ suggestedPriceCo2eRange }}
          </span>
        </div>
        <div v-if="record.title == 'Similar Products'">
          <a-tag color="red" v-if="!similarProductCo2e">Unknown</a-tag>
          <span v-if="similarProductCo2e">{{ similarProductCo2e }}</span>
        </div>
        <div v-if="record.title == 'Savings Summary'">
          <a-tag color="red">Unknown</a-tag>
        </div>
      </div>

      <div slot="expandedRowRender" slot-scope="innerRow" class="basket-row-inner-expanded-row-render">
        <suggested-prices v-if="innerRow.title == 'Suggested Prices'" :row="row"></suggested-prices>
        <similar-products v-if="innerRow.title == 'Similar Products'" :row="row"></similar-products>
        <savings-summary v-if="innerRow.title == 'Savings Summary'" :row="row"></savings-summary>
      </div>
    </a-table>
    <!--    {{ row }}-->
  </div>
</template>

<script>
import SuggestedPrices from "./BasketRowInner/SuggestedPrices";
import SimilarProducts from "./BasketRowInner/SimilarProducts";
import SavingsSummary from "./BasketRowInner/SavingsSummary";
import Orders from "../../../mixins/Orders";

const _ = require("lodash");

export default {
  name: "BasketRowInner",
  components: { SavingsSummary, SimilarProducts, SuggestedPrices },
  mixins: [Orders],
  props: ["row"],
  data() {
    return {
      columns: [
        {
          dataIndex: "icon",
          scopedSlots: { customRender: "icon" },
          width: 50,
        },
        {
          dataIndex: "title",
          scopedSlots: { customRender: "name" },
          // width: 595
        },
        {
          dataIndex: "summary",
          scopedSlots: { customRender: "summary" },
        },
        {
          dataIndex: "summary",
          // width: 50,
          scopedSlots: { customRender: "summary-tags" },
        },
        {
          dataIndex: "additional_summary",
          scopedSlots: { customRender: "additional_summary" },
        },
        {},
      ],
    };
  },
  methods: {
    getExpandIcon({ expanded, record, onExpand }) {
      return record.section !== "Lifespan" ? (
        <a-button
          style="font-weight: 500; padding-left: 0; padding-right; 0; float: right;"
          type="link"
          {...{
            on: {
              click: onExpand.bind(this, [expanded, record]),
            },
          }}
        >
          <span>{expanded ? "Hide" : "Expand"}</span>
          <a-icon style="font-size: 10px; font-weight: 500;" type={expanded ? "up" : "down"}></a-icon>
        </a-button>
      ) : (
        <a-button style="opacity: 0; cursor: default;"></a-button>
      );
    },
  },
  computed: {
    innerRows() {
      let rows = [
        {
          icon: "thunderbolt",
          title: "Suggested Prices",
        },
      ];
      if (this.row.itemType === "order" || this.row.itemType === "product") {
        rows.push({
          icon: "gold",
          title: "Similar Products",
        });
      }
      rows.push({
        icon: "dollar",
        title: "Savings Summary",
      });
      return rows;
    },

    similarProductCo2e() {
      // if (this.row.suggestedProducts) {
      let co2es = _.map(this.row.suggestedProducts, "co2e");
      co2es = _.filter(co2es, (co2e) => co2e);
      console.log("co2es");
      console.log(co2es);
      if (co2es.length) {
        // let totals = _.map(co2es, 'co2e');
        // return _.sum(totals, 'co2e.total') + ' kg';
        let summed = _.sum(co2es);
        if (summed) {
          return Math.floor(_.sum(co2es) * this.row.quantity * 100) / 100 + " kg";
        }
        return null;
      }
      return null;
    },

    benchmarkPrice() {
      // let prices = _.map(this.row.prices, 'price');
      // let average = _.mean(prices) * 1.3;
      // return average;
      if (this.row.itemType == "product" && this.row.suggestedProducts.length) {
        let costs = _.map(this.row.suggestedProducts, "cost");
        return _.min(costs) * this.row.quantity;
      }

      if (this.row.order && this.row.order.id == 3) {
        return 16183.59 * 100;
      }

      let prices = _.map(this.row.prices, "price");
      let average = _.mean(prices) * 1.3;
      return average;
    },

    comparisons() {
      let comparisons = [
        {
          comparison: "Benchmark",
          cost: this.benchmarkPrice,
          savings: this.row.selectedPrice ? this.benchmarkPrice - this.row.selectedPrice.price : 0,
        },
      ];

      if (this.row.order) {
        comparisons.push({
          comparison: "Exact Match",
          cost: this.row.order.cost,
          // savings: (this.benchmarkPrice - this.row.order.cost)
          savings: this.row.selectedPrice ? this.row.order.cost - this.row.selectedPrice.price : 0,
        });
        comparisons.push({
          comparison: "Similar Match",
          cost: 15622 * 100,
          savings: this.row.selectedPrice ? 15622 * 100 - this.row.selectedPrice.price : 0,
          similarity: 87,
        });
      }

      return comparisons;
    },

    savingsRange() {
      let ordered = _.orderBy(this.comparisons, "savings");
      let minSaving = _.first(ordered);
      let maxSaving = _.last(ordered);

      if (minSaving !== maxSaving) {
        let minPriceFormatted = this.formatCostInPence2dp({
          cost: minSaving.savings,
          cost_currency: "USD",
        });

        let maxPriceFormatted = this.formatCostInPence2dp({
          cost: maxSaving.savings,
          cost_currency: "USD",
        });

        return minPriceFormatted + " → " + maxPriceFormatted;
      } else {
        return this.formatCostInPence2dp({
          cost: minSaving.savings,
          cost_currency: "USD",
        });
      }
    },

    suggestedPriceRangeForOrder() {
      if (this.row.order) {
        let costs = [this.row.order.cost];
        if (this.row.order.id == 3) {
          costs.push(15622 * 100);
        }
        let minPrice = _.min(costs);
        let maxPrice = _.max(costs);

        if (minPrice !== maxPrice) {
          let minPriceFormatted = this.formatCostInPence2dp({
            cost: minPrice,
            cost_currency: "USD",
          });

          let maxPriceFormatted = this.formatCostInPence2dp({
            cost: maxPrice,
            cost_currency: "USD",
          });

          return minPriceFormatted + " → " + maxPriceFormatted;
        } else {
          return this.formatCostInPence2dp({
            cost: minPrice,
            cost_currency: "USD",
          });
        }
      }
      return "";
    },

    suggestedPriceRangeForSimilarProducts() {
      if (!this.row.suggestedProducts || this.row.suggestedProducts.length === 0) {
        return "";
      }
      let ordered = _.orderBy(this.row.suggestedProducts, "cost");
      let minPrice = _.first(ordered);
      let maxPrice = _.last(ordered);

      if (minPrice !== maxPrice) {
        let minPriceFormatted = this.formatCostInPence2dp({
          cost: minPrice.cost * this.row.quantity,
          cost_currency: "USD",
        });

        let maxPriceFormatted = this.formatCostInPence2dp({
          cost: maxPrice.cost * this.row.quantity,
          cost_currency: "USD",
        });

        return minPriceFormatted + " → " + maxPriceFormatted;
      } else {
        return this.formatCostInPence2dp({
          cost: minPrice.cost * this.row.quantity,
          cost_currency: "USD",
        });
      }
    },

    suggestedPriceRange() {
      let prices = this.row.prices;
      if (prices && prices.length) {
        let ordered = _.orderBy(prices, "price");
        let minPrice = _.first(ordered);
        let maxPrice = _.last(ordered);

        if (minPrice !== maxPrice) {
          let minPriceFormatted = this.formatCostInPence2dp({
            cost: minPrice.price,
            cost_currency: "USD",
          });

          let maxPriceFormatted = this.formatCostInPence2dp({
            cost: maxPrice.price,
            cost_currency: "USD",
          });

          return minPriceFormatted + " → " + maxPriceFormatted;
        } else {
          return this.formatCostInPence2dp({
            cost: minPrice.price,
            cost_currency: "USD",
          });
        }
      }
      return "-";
    },

    suggestedPriceCo2eRange() {
      let prices = this.row.prices;
      if (prices && prices.length) {
        let ordered = _.orderBy(prices, "co2e");
        let minCo2e = _.first(ordered).co2e;
        let maxCo2e = _.last(ordered).co2e;

        if (minCo2e !== maxCo2e) {
          let minCo2eFormatted = Math.floor(minCo2e * 100) / 100;
          let maxCo2eFormatted = Math.floor(maxCo2e * 100) / 100;

          return minCo2eFormatted + " → " + maxCo2eFormatted + " kg";
        } else {
          return Math.floor(minCo2e * 100) / 100 + " kg";
        }
      }
      return "-";
    },
  },
};
</script>

<style lang="scss">
.basketRowInnerTable {
  .rowIcon {
    font-size: 28px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .ant-table-expanded-row,
  .ant-table-expanded-row:hover {
    background: #eee;

    .ant-table-placeholder {
      background: #eee;
    }
  }

  .name {
    font-weight: 500;
  }

  tr:hover {
    td {
      background: none !important;
    }
  }

  tr:last-child {
    td {
      border-bottom: none !important;
    }
  }

  .ant-table-tbody > tr > td {
    //border-bottom: none !important;
    border-bottom: 1px solid #e8e8e8 !important;
  }

  .ant-table-expanded-row {
    tr {
      th {
        //border-bottom: 0;
      }

      td {
        border-bottom: 0 solid #e8e8e8 !important;
      }

      &:last-child {
        td {
          border-bottom: 0 !important;
        }
      }
    }
  }
}

.summary-column {
  text-align: right;
  //padding-right: 30px;
}
</style>
