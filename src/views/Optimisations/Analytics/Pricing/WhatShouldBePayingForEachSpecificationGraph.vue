<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin />
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
      <v-tooltip :shared="true" :show-title="false"></v-tooltip>
      <v-interval position="specification*trueprice" opacity="1"> </v-interval>
      <v-point position="specification*matching_order_prices" :size="4" :opacity="0.65" shape="circle" />
      <v-axis :auto-rotate="true" dataKey="specification" :title="{ text: 'Specification' }"> </v-axis>
      <v-axis dataKey="trueprice" :title="{ text: 'Trueprice' }"> </v-axis>
      <v-axis dataKey="matching_order_prices" :title="{ text: 'Matching Order Prices' }"> </v-axis>
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";

const _ = require("lodash");
import Orders from "../../../../mixins/Orders";

import { mapGetters } from "vuex";

export default {
  name: "WhatShouldBePayingForSpecificationGraph",
  props: ["optimisationId"],
  mixins: [Orders],
  data() {
    return {
      isLoading: true,
      data: null,
      height: 500,
    };
  },
  computed: {
    ...mapGetters("optimisationAnalyticsManager", {
      filterBySupplier: "filterBySupplier",
      filterBySpecification: "filterBySpecification",
      selectedSupplier: "selectedSupplier",
      selectedSpecification: "selectedSpecification",
    }),

    graphData() {
      if (!this.data) {
        return [];
      }

      let sourceData = [];
      _.each(this.data, (specData) => {
        sourceData.push({
          specification_full: specData.optimisation_specification.product_name,
          specification: specData.optimisation_specification.product_name.substring(0, 15) + "...",
          // 'specification': specData.optimisation_specification.product_name,
          trueprice: specData.trueprice,
          matching_order_prices: specData.matching_order_prices,
          matching_order_price_min: _.min(specData.matching_order_prices),
          matching_order_price_max: _.max(specData.matching_order_prices),
        });
      });
      // return sourceData;
      return _.sortBy(sourceData, "trueprice");
    },
    priceMin() {
      return 0;
    },
    priceMax() {
      let maxTrueprice = _.max(_.map(this.graphData, "trueprice"));
      let maxMatchingOrderPrice = _.max(_.map(this.graphData, "matching_order_price_max"));

      return _.max([maxTrueprice, maxMatchingOrderPrice]);
    },
    scale() {
      return [
        {
          dataKey: "specification",
          type: "cat",
          // values: _.map(this.data, 'optimisation_specification.product_name'),
        },
        {
          dataKey: "trueprice",
          formatter: (val) => {
            return this.formatCost({ cost: val, cost_currency: "USD" });
          },
          min: this.priceMin,
          max: this.priceMax,
        },
        {
          dataKey: "matching_order_prices",
          formatter: () => {
            return "";
            // return this.formatCost({cost: val, cost_currency: 'USD'})
          },
          min: this.priceMin,
          max: this.priceMax,
        },
      ];
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;

      let params = {};

      if (this.filterBySupplier && this.selectedSupplier) {
        params["supplier_id"] = this.selectedSupplier.id;
      }

      if (this.filterBySpecification && this.selectedSpecification) {
        params["optimisation_specification_id"] = this.selectedSpecification.id;
      }

      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisationId + "/price-analytics", params)
        .then((r) => {
          vm.isLoading = false;
          vm.data = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading price analytics");
        });
    },
  },
  watch: {
    filterBySupplier() {
      this.fetch();
    },
    selectedSupplier() {
      this.fetch();
    },
    filterBySpecification() {
      this.fetch();
    },
    selectedSpecification() {
      this.fetch();
    },
  },
};
</script>

<style scoped>
.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}
</style>
