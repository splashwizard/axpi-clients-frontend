<template>
  <div>
    <table class="axpi-basic-table">
      <thead>
        <tr>
          <th colspan="2">Details</th>
          <th>Match</th>
          <th>Potential Savings</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <insight-row v-for="(insight, i) in insights" :key="i" :insight="insight"></insight-row>
      </tbody>
    </table>
  </div>
</template>

<script>
import InsightRow from "./GroupInsightsTable/InsightRow.vue";
export default {
  name: "GroupInsightsTable",
  components: {InsightRow},
  props: ["insights"],
  methods: {},
};
</script>

<style scoped>
</style>