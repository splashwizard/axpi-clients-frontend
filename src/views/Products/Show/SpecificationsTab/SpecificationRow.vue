<template>
  <tr>
    <td>{{ detail['propertyName'] }}</td>
    <td>{{ formatVal(detail['rawMagnitude']) }} {{ detail['unit'] }}</td>
    <td>{{ formatVal(detail['normalisedUnitMagnitude']) }} {{ detail['normalisedUnitBase'] }}</td>
  </tr>
</template>

<script>
export default {
  name: "SpecificationRow",
  props: ['detail'],
  methods: {
    formatVal(val) {
      if (val < 1) {
        val = Number.parseFloat(val).toExponential(3);
      }
      return val;
    }
  }
}
</script>

<style scoped>

</style>