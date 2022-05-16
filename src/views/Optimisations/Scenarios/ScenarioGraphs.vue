<template>
  <div class="scenario-graphs">
    <a-row :gutter="20">
      <a-col :span="12">
        <scenario-metric-heatmap :scenarios="scenarios"></scenario-metric-heatmap>
      </a-col>
      <a-col :span="12">
        <spec-breakdown-pie-chart :scenarios="scenarios"></spec-breakdown-pie-chart>
      </a-col>
    </a-row>

    <!--    &lt;!&ndash; Not Saved &ndash;&gt;-->
    <!--    <a-row :gutter="5" v-if="!isSaved">-->
    <!--      <a-col :span="12">-->
    <!--        <div class="graph-container">-->
    <!--          <iframe src='https://flo.uri.sh/visualisation/6040351/embed' title='Interactive or visual content'-->
    <!--                  frameborder='0' scrolling='no' style='width:100%;height:400px;'-->
    <!--                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>-->
    <!--        </div>-->
    <!--      </a-col>-->
    <!--      <a-col :span="12">-->
    <!--        <div class="graph-container">-->
    <!--          <iframe src='https://flo.uri.sh/visualisation/6040357/embed' title='Interactive or visual content'-->
    <!--                  frameborder='0' scrolling='no' style='width:100%;height:400px;'-->
    <!--                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>-->
    <!--        </div>-->
    <!--      </a-col>-->
    <!--    </a-row>-->
    <!--    &lt;!&ndash; / Not Saved &ndash;&gt;-->

    <!--    &lt;!&ndash; Saved &ndash;&gt;-->
    <!--    <a-row :gutter="5" v-if="isSaved">-->
    <!--      <a-col :span="12">-->
    <!--        <div class="graph-container">-->
    <!--          <iframe src='https://flo.uri.sh/visualisation/6016612/embed' title='Interactive or visual content'-->
    <!--                  frameborder='0' scrolling='no' style='width:100%;height:400px;'-->
    <!--                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>-->
    <!--        </div>-->
    <!--      </a-col>-->
    <!--      <a-col :span="12">-->
    <!--        <div class="graph-container">-->
    <!--          <iframe src='https://flo.uri.sh/visualisation/6016755/embed' title='Interactive or visual content'-->
    <!--                  frameborder='0' scrolling='no' style='width:100%;height:400px;'-->
    <!--                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>-->
    <!--        </div>-->
    <!--      </a-col>-->
    <!--    </a-row>-->
    <!--    &lt;!&ndash; / Saved &ndash;&gt;-->
  </div>
</template>

<script>
// import ScenarioMetricHeatmap from "./ScenarioGraphs/ScenarioMetricHeatmap";

import ScenarioMetricHeatmap from "./ScenarioGraphs/ScenarioMetricHeatmap";
import SpecBreakdownPieChart from "./ScenarioGraphs/SpecBreakdownPieChart";
export default {
  name: "ScenarioGraphs",
  components: { ScenarioMetricHeatmap, SpecBreakdownPieChart },
  props: ["scenarios"],
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
  margin-bottom: 30px;
}

.graph-container {
  border: 1px solid #eee;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
}

.graph-container .bottom-toolbar {
  text-align: right;
  padding-bottom: 10px;
}
</style>
