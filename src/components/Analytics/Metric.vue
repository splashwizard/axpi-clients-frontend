<template>
  <div class="metric-container" :class="{'active': isActive}" :style="metricStyle">
    <div class="ant-statistic" v-if="metric" @click="toggleActive">
      <div class="ant-statistic-title">
        <span v-if="!isActive">{{ metric.label }}</span>
        <a-dropdown v-if="isActive" :trigger="['click']">
          <a class="ant-dropdown-link" :style="textStyle"
             @click.stop="e => e.preventDefault()">
            {{ metric.label }}
            <a-icon type="down"/>
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
           {{ metric.value }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
let _ = require('lodash');
export default {
  props: ['id', 'metrics', 'initial', 'isActive', 'backgroundColour', 'textColour'],
  name: "Metric",
  data() {
    return {
      selectedMetricId: ''
    }
  },
  created() {
    this.selectedMetricId = this.initial;
  },
  computed: {
    metric() {
      let metric = _.find(this.metrics, {
        id: this.selectedMetricId
      });
      return metric ? metric : null
    },

    metricStyle() {
      let s = '';
      if (this.isActive) {
        s = s + ' background-color: ' + this.backgroundColour + ';';
      }
      return s;
    },

    textStyle() {
      let s = '';
      if (this.isActive) {
        s = s + ' color: ' + this.textColour + ';';
      }
      return s;
    }
  },
  methods: {
    toggleActive() {
      this.$emit('toggle-active', this.id);
    },

    selectMetric(m) {
      console.log(m);
      this.selectedMetricId = m.id;
    }
  }
}
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