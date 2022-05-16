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
      <!--      <tbody>-->
      <insight-row
        v-for="(insight, i) in insights"
        :key="i"
        :insights-applied-local="insightsAppliedLocal"
        :insight="insight"
        @toggle-insight-applied="(insight) => $emit('toggle-insight-applied', insight)"
      ></insight-row>
      <!--      </tbody>-->
    </table>
  </div>
</template>

<script>
import InsightRow from "./GroupInsightsTable/InsightRow.vue";

export default {
  name: "GroupInsightsTable",
  components: { InsightRow },
  props: ["insights", "insightsAppliedLocal"],
  methods: {},
};
</script>

<style scoped></style>
