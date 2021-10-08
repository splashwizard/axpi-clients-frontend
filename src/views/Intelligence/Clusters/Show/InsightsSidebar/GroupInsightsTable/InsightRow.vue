<template>
  <tr>
    <td>
      <a-avatar size="large" :src="getImageSrc(getFirstProduct(insight))" />
    </td>
    <td>
      <b>{{ getFirstProduct(insight)["Name"] }}</b>
    </td>
    <td>93%</td>
    <td>$2,000</td>
    <td class="action">
      <a-button type="primary">Select</a-button>
    </td>
  </tr>
</template>

<script>
export default {
  props: ["insight"],
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