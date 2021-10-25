<template>
  <tr>
    <td>{{ detail['propertyName'] }}</td>
    <td>{{ formatVal(detail['rawMagnitude']) }} {{ detail['unit'] }}</td>
    <td>
      <span v-html="formatVal(detail['normalisedUnitMagnitude'])"></span>
    </td>
    <td>{{ detail['normalisedUnitBase'] !== 'dimensionless' ? detail['normalisedUnitBase'] : null }}</td>
  </tr>
</template>

<script>
export default {
  name: "SpecificationRow",
  props: ['detail'],
  methods: {
    formatVal(val) {
      if (val < 1) {
        let exp = Number.parseFloat(val).toExponential(3);
        let split = exp.split('e');
        val = split[0] + ' x 10' + '<sup>' + split[1] + '</sup>'
      }
      return val;
    }
  }
}
</script>

<style scoped>

</style>