<template>
  <div class="environment-tab">
    <a-row :gutter="40">
      <a-col :span="12">
        <b>Which are your most environmentally friendly suppliers?</b>
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/5840581/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>

          <!-- Bottom toolbar -->
          <div class="bottom-toolbar">
            <a-button type="link">
              View Supplier Analysis
              <a-icon type="right"></a-icon>
            </a-button>
          </div>
          <!-- / Bottom toolbar -->
        </div>
      </a-col>
      <a-col :span="12">
        <b>Where are your emissions coming from?</b>
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/5840604/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>

          <!-- Bottom toolbar -->
          <div class="bottom-toolbar">
            <a-button type="link">
              View Emissions
              <a-icon type="right"></a-icon>
            </a-button>
          </div>
          <!-- / Bottom toolbar -->
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="40">
      <a-col :span="12">
        <b>How much of the material you use comes from recycled sources?</b>
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/5840997/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>

          <!-- Bottom toolbar -->
          <div class="bottom-toolbar">
            <a-button type="link">
              View Recycling Analysis
              <a-icon type="right"></a-icon>
            </a-button>
          </div>
          <!-- / Bottom toolbar -->
        </div>
      </a-col>
      <a-col :span="12">
        <b>In which categories are your emissions coming from?</b>
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/5840812/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>

          <!-- Bottom toolbar -->
          <div class="bottom-toolbar">
            <a-button type="link">
              View Emissions
              <a-icon type="right"></a-icon>
            </a-button>
          </div>
          <!-- / Bottom toolbar -->
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="40">
      <a-col :span="12">
        <b>What accreditations do the papers you use have?</b>
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/5840918/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>

          <!-- Bottom toolbar -->
          <div class="bottom-toolbar">
            <a-button type="link">
              View Accreditations
              <a-icon type="right"></a-icon>
            </a-button>
          </div>
          <!-- / Bottom toolbar -->
        </div>
      </a-col>
      <a-col :span="12">
        <b>How do your suppliers perform across the metrics?</b>
        <div class="graph-container">
          <iframe
            src="https://flo.uri.sh/visualisation/5840907/embed"
            title="Interactive or visual content"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 400px"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>

          <!-- Bottom toolbar -->
          <div class="bottom-toolbar">
            <a-button type="link">
              View Supplier Analysis
              <a-icon type="right"></a-icon>
            </a-button>
          </div>
          <!-- / Bottom toolbar -->
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "EnvironmentTab",
};
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

.graph-container .bottom-toolbar {
  text-align: right;
  padding-bottom: 10px;
}

.ant-row {
  margin-bottom: 40px;
}
</style>
