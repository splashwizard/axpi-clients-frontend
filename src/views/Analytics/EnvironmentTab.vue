<template>
  <div class="environment-tab">
    <a-row :gutter="40">
      <a-col :span="12">
        <b>Water and CO2e per dollar</b>
        <div class="graph-container">
          <iframe src='https://flo.uri.sh/visualisation/5840581/embed' title='Interactive or visual content'
                  frameborder='0'
                  scrolling='no' style='width:100%;height:400px;'
                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>

        </div>
      </a-col>
      <a-col :span="12">
        <b>CO2e breakdown by subtype by source</b>
        <div class="graph-container">
          <iframe src='https://flo.uri.sh/visualisation/5840604/embed' title='Interactive or visual content'
                  frameborder='0' scrolling='no' style='width:100%;height:400px;'
                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="40">
      <a-col :span="12">
        <b>Recycled Material Used By Material Type</b>
        <div class="graph-container">
          <iframe src='https://flo.uri.sh/visualisation/5840997/embed' title='Interactive or visual content'
                  frameborder='0' scrolling='no' style='width:100%;height:400px;'
                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
        </div>
      </a-col>
      <a-col :span="12">
        <b>Breakdown of emissions by supplier, category and spec</b>
        <div class="graph-container">
          <iframe src='https://flo.uri.sh/visualisation/5840812/embed' title='Interactive or visual content'
                  frameborder='0' scrolling='no' style='width:100%;height:400px;'
                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="40">
      <a-col :span="12">
        <b>Paper Accreditations</b>
        <div class="graph-container">
          <iframe src='https://flo.uri.sh/visualisation/5840918/embed' title='Interactive or visual content'
                  frameborder='0' scrolling='no' style='width:100%;height:400px;'
                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
        </div>
      </a-col>
      <a-col :span="12">
        <b>Metric per dollar for suppliers</b>
        <div class="graph-container">
          <iframe src='https://flo.uri.sh/visualisation/5840907/embed' title='Interactive or visual content'
                  frameborder='0' scrolling='no' style='width:100%;height:400px;'
                  sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "EnvironmentTab"
}
</script>

<style scoped>
.environment-tab {
  padding-top: 20px;
  padding-bottom: 20px;
}

.environment-tab b {
  text-transform: uppercase;
}

.graph-container {
  border: 1px solid #eee;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
}

.ant-row {
  margin-bottom: 40px;
}
</style>