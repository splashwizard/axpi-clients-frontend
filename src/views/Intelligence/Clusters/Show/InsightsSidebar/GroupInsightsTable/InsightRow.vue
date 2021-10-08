<template>
  <tr>
    <td>
      <a-avatar size="large" :src="getImageSrc(getFirstProduct(insight))" />
    </td>
    <td>
      <b>{{ getFirstProduct(insight)["Name"] }}</b>
    </td>
    <td>93%</td>
    <td>
      {{ formatCost({cost: insight['potential_savings'], cost_currency: 'USD'}) }}
    </td>
    <td class="action">
      <a-button type="primary">Select</a-button>
    </td>
  </tr>
</template>

<script>
import Orders from "../../../../../../mixins/Orders";
export default {
  props: ["insight"],
  mixins: [Orders],
  methods: {
    getFirstProduct(insight) {
      return insight["products"]["compared_to"][0];
    },

    getImageSrc(product) {
      if (product["Images"] && product["Images"].length) {
        return product["Images"][0];
      }
    },
  },
};
</script>

<style>
</style>