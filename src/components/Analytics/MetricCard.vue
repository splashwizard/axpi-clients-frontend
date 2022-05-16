<template>
  <div class="metric-container" :class="{ active: isActive }" @click="toggleActive" :style="metricStyle">
    <div class="ant-statistic" v-if="metric">
      <div class="ant-statistic-title">
        <span v-if="!isActive">{{ metric.label }}</span>
        <a-dropdown v-if="isActive" :trigger="['click']">
          <a class="ant-dropdown-link" :style="textStyle" @click.stop="(e) => e.preventDefault()">
            {{ metric.label }}
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-for="m in metrics" :key="m.id">
              <a href="#" @click="selectMetric(m)">{{ m.label }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="ant-statistic-content">
        <span class="ant-statistic-content-value">
          <span class="ant-statistic-content-value-int" :style="textStyle">
            {{ metric.value(this.startMonth, this.endMonth, metric.time_series_data) }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
let _ = require("lodash");
export default {
  props: [
    "index",
    "metrics",
    "selectedMetricId",
    "isActive",
    "backgroundColour",
    "textColour",
    "startMonth",
    "endMonth",
  ],
  name: "MetricCard",
  data() {
    return {};
  },
  computed: {
    metric() {
      let metric = _.find(this.metrics, {
        id: this.selectedMetricId,
      });
      return metric ? metric : null;
    },

    metricStyle() {
      let s = "";
      if (this.isActive) {
        s = s + " background-color: " + this.backgroundColour + ";";
      }
      return s;
    },

    textStyle() {
      let s = "";
      if (this.isActive) {
        s = s + " color: " + this.textColour + ";";
      }
      return s;
    },
  },
  methods: {
    toggleActive() {
      this.$emit("toggle-active", this.index);
    },

    selectMetric(m) {
      this.$emit("metric-changed", {
        index: this.index,
        metric_id: m.id,
      });
    },
  },
};
</script>

<style scoped>
.metric-container {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgb(227, 232, 238);
}

.metric-container:hover {
  cursor: pointer;
}
</style>
