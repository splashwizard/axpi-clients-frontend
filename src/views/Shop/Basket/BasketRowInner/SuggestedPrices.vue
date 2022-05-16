<template>
  <a-table
    class="suggested-prices-row"
    slot="expandedRowRender"
    :columns="columns"
    :data-source="pricesWithSavings"
    :pagination="false"
  >
    <div slot="supplier" slot-scope="supplier, record">
      <span style="margin-right: 15px">{{ supplier }}</span>
      <a-tag
        color="blue"
        v-for="(certification, i) in limitCertifications(record.supplier_certifications, record.id)"
        :key="getCertificationKey(i)"
      >
        {{ certification.name }}
      </a-tag>
      <a
        href="#"
        @click.prevent="() => toggleShowMoreCertificationsForPrice(record)"
        v-if="howManyMoreCertifications(record.supplier_certifications, record.id) > 0"
      >
        + {{ howManyMoreCertifications(record.supplier_certifications, record.id) }} more
      </a>
      <a
        href="#"
        @click.prevent="() => toggleShowMoreCertificationsForPrice(record)"
        v-if="showMoreCertificationsForPriceIds.includes(record.id)"
      >
        Show less
      </a>
    </div>
    <div slot="cost" slot-scope="cost, record">
      {{
        record.price
          ? formatCostInPence2dp({
              cost: record.price,
              cost_currency: "USD",
            })
          : "-"
      }}
    </div>
    <div slot="savings" slot-scope="savings">
      {{
        savings
          ? formatCostInPence2dp({
              cost: savings,
              cost_currency: "USD",
            })
          : "-"
      }}
    </div>
    <div slot="co2e" slot-scope="co2e">
      <span v-if="getSupplierCo2e(co2e, row)"> {{ getSupplierCo2e(co2e, row) }} kg </span>
      <a-tag color="red" v-else>Unknown</a-tag>
    </div>
  </a-table>
</template>

<script>
import Orders from "../../../../mixins/Orders";

const _ = require("lodash");

const columns = [
  { title: "Supplier", dataIndex: "supplier_name", key: "supplier_name", scopedSlots: { customRender: "supplier" } },
  { title: "Cost", dataIndex: "cost", key: "cost", scopedSlots: { customRender: "cost" } },
  { title: "Savings", dataIndex: "savings", key: "savings", scopedSlots: { customRender: "savings" } },
  { title: "CO2e", dataIndex: "co2e", key: "co2e", scopedSlots: { customRender: "co2e" } },
];

export default {
  name: "SuggestedPrices",
  mixins: [Orders],
  props: ["row"],
  data() {
    return {
      columns,
      showMoreCertificationsForPriceIds: [],
    };
  },
  computed: {
    benchmarkPrice() {
      let prices = _.map(this.row.prices, "price");
      let average = _.mean(prices) * 1.3;

      if (this.row.order && this.row.order.id == 3) {
        return 16183.59 * 100;
      }

      return average;
    },

    pricesWithSavings() {
      return _.map(this.row.prices, (r) => {
        return {
          savings: this.benchmarkPrice - r.price,
          ...r,
        };
      });
    },
  },
  methods: {
    getSupplierCo2e(co2e, item) {
      let co2eToReturn = co2e;
      if (item.itemType === "product") {
        co2eToReturn = co2eToReturn * item.quantity;
      }
      return co2eToReturn ? Math.round(co2eToReturn * 100) / 100 : 0;
    },

    limitCertifications(certs, priceId = null) {
      if (this.showMoreCertificationsForPriceIds.includes(priceId)) {
        return certs;
      }
      return certs.slice(0, 2);
    },

    howManyMoreCertifications(certs, priceId) {
      if (this.showMoreCertificationsForPriceIds.includes(priceId)) {
        return 0;
      }
      return certs.length - 2;
    },

    getCertificationKey(i) {
      return "certification-" + Math.random() + "-" + i;
    },

    toggleShowMoreCertificationsForPrice(price) {
      this.showMoreCertificationsForPriceIds = _.xor(this.showMoreCertificationsForPriceIds, [price.id]);
    },
  },
};
</script>

<style lang="scss">
.suggested-prices-row {
  th {
    padding-top: 5px !important;
  }

  td {
    //border-bottom: 1px solid #e8e8e8 !important;
  }
}
</style>
