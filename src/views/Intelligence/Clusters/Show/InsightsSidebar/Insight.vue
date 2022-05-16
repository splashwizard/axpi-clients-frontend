<template>
  <div class="insight-wrapper">
    <a-collapse class="collapse-margin-bottom">
      <a-collapse-panel key="1" :header="insightSummary"> </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export default {
  name: "Insight",
  props: ["insight"],
  computed: {
    insightSummary() {
      return this.insight["descriptions"]["base"];
    },
  },
};
</script>

<style scoped>
.insight-wrapper {
  margin-bottom: 20px;
}
</style>
