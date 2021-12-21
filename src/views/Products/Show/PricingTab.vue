<template>
  <div style="padding-top: 15px;">
    <table class="axpi-basic-table">
      <thead>
      <tr>
        <th width="300">Supplier</th>
        <th>Price</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(price, i) in prices" :key="i">
        <td>{{ price.supplier_name }}</td>
        <td>
          {{
            price ? formatCostInPence2dp({
              cost: price.price,
              cost_currency: 'USD'
            }) : '-'
          }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Orders from "../../../mixins/Orders";

export default {
  name: "PricingTab",
  props: ['prices'],
  mixins: [Orders],
  data() {
    return {
      isLoading: false
    }
  }
}
</script>

<style scoped>

</style>