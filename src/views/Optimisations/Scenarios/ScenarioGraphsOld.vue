<template>
  <div class="scenario-graphs">
    <!-- Not Saved -->
    <a-row :gutter="5" v-if="!isSaved">
      <a-col :span="12">
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/6040351/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/6040357/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>
        </div>
      </a-col>
    </a-row>
    <!-- / Not Saved -->

    <!-- Saved -->
    <a-row :gutter="5" v-if="isSaved">
      <a-col :span="12">
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/6016612/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/6016755/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>
        </div>
      </a-col>
    </a-row>
    <!-- / Saved -->
  </div>
</template>

<script>
// import ScenarioMetricHeatmap from "./ScenarioGraphs/ScenarioMetricHeatmap";

export default {
  name: "ScenarioGraphs",
  computed: {
    isSaved() {
      return this.$route.query.saved;
    },
  },
  // components: {ScenarioMetricHeatmap}
};
</script>

<style scoped>
.scenario-graphs {
  margin-bottom: 0;
}

.graph-container {
}
</style>
