<template>
  <div class="form-section">
    <div class="form-header">
      <h2>Optimisation Metrics</h2>
    </div>

    <div class="icon-selector">
      <a href="#" @click.prevent="select('best-price')" :class="{ selected: isSelected('best-price') }">
        <div class="icon">
          <img src="/img/icons/scenarios/value_optimisation_icon.svg" alt="Value" />
        </div>
        <div class="caption">Best Price</div>
      </a>
      <a
        href="#"
        @click.prevent="select('environmentally-friendly')"
        :class="{ selected: isSelected('environmentally-friendly') }"
      >
        <div class="icon">
          <img src="/img/icons/scenarios/environment_optimisation_icon.svg" alt="POS" />
        </div>
        <div class="caption">Environmentally Friendly</div>
      </a>
      <!--      <a href="#" @click.prevent="select('socially-responsible')"-->
      <!--         :class="{'selected': isSelected('socially-responsible')}">-->
      <!--        <div class="icon">-->
      <!--          <img src="/img/icons/product-type-selector/apparel.png" alt="Apparel">-->
      <!--        </div>-->
      <!--        <div class="caption">-->
      <!--          Socially Responsible-->
      <!--        </div>-->
      <!--      </a>-->
      <a href="#" @click.prevent="select('custom')" :class="{ selected: isSelected('custom') }">
        <div class="icon">
          <!--          <img src="/img/icons/product-type-selector/merchandise.png" alt="Merchandise">-->
          <a-icon type="plus" style="font-size: 30px; color: #97bbf1"></a-icon>
        </div>
        <div class="caption">Custom</div>
      </a>
    </div>

    <div class="custom-metrics-wrapper" v-if="isSelected('custom')">
      <!-- Custom metric -->
      <div class="custom-metric" v-for="(metric, i) in addLabelsToCustomMetrics(scenario.custom_metrics)" :key="i">
        <div class="metric-header">
          <b class="metric-label">{{ metric.label }}</b>
          <a-button type="link" icon="delete" @click.prevent="deleteMetric(metric)"></a-button>
        </div>
        <div class="icon-wrapper">
          <!--          <a-icon :style="{ color: preColor(metric.value) }" type="frown-o"/>-->
          <!--          <span></span>-->
          <div
            v-if="metric.label === 'Cost'"
            style="width: 25px"
            :style="{ color: preColor(metric.value) }"
            class="anticon"
          >
            $$
          </div>

          <div v-if="metric.label === 'CO2e'" :style="{ color: preColor(metric.value) }" class="anticon">
            <img src="/img/icons/bad_environment.svg" width="15" alt="Bad environment" />
          </div>

          <a-slider
            :min="min"
            :max="max"
            :value="metric.value"
            @change="(val) => handleMetricValueChange(metric, val)"
          />

          <div v-if="metric.label === 'Cost'" :style="{ color: nextColor(metric.value) }" class="anticon">$</div>

          <div v-if="metric.label === 'CO2e'" :style="{ color: nextColor(metric.value) }" class="anticon">
            <img src="/img/icons/healthy_environment.svg" width="15" alt="Bad environment" />
          </div>
        </div>
      </div>
      <!-- / Custom metric -->

      <!-- Add metric -->
      <div class="add-metric">
        <a-dropdown :trigger="['click']">
          <a-button icon="plus"
            >Add Metric
            <a-icon type="down" />
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item v-for="(metric, i) in addableMetrics" :key="i">
              <a href="#" @click="addMetric(metric)">
                {{ metric.label }}
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <!-- / Add metric -->
    </div>
  </div>
</template>

<script>
const _ = require("lodash");
export default {
  name: "OptimisationMetrics",
  props: ["scenario"],
  data() {
    return {
      min: 0,
      max: 100,

      availableMetrics: [
        {
          id: "cost",
          label: "Cost",
          value: 0,
        },
        {
          id: "risk",
          label: "Risk",
          value: 0,
        },
        {
          id: "quality",
          label: "Quality",
          value: 0,
        },
        {
          id: "social-responsibility",
          label: "Social Responsibility",
          value: 0,
        },
        {
          id: "co2e",
          label: "CO2e",
          value: 0,
        },
        {
          id: "water-use",
          label: "Water Use",
          value: 0,
        },
        {
          id: "plastic-use",
          label: "Plastic Use",
          value: 0,
        },
        {
          id: "recycling",
          label: "Recycling",
          value: 0,
        },
      ],
    };
  },
  methods: {
    select(key) {
      this.scenario.optimisation_metric = key;
      this.forceRefresh();
    },

    isSelected(key) {
      return this.scenario.optimisation_metric === key;
    },

    forceRefresh() {
      this.$forceUpdate();
    },

    addMetric(metric) {
      this.scenario.custom_metrics.push(_.cloneDeep(metric));
      this.forceRefresh();
    },

    preColor(value) {
      const { max, min } = this;
      const mid = ((max - min) / 2).toFixed(5);
      return value >= mid ? "" : "rgba(0, 0, 0, .45)";
    },
    nextColor(value) {
      const { max, min } = this;
      const mid = ((max - min) / 2).toFixed(5);
      return value >= mid ? "rgba(0, 0, 0, .45)" : "";
    },

    handleMetricValueChange(metric, val) {
      metric.value = val;
      this.forceRefresh();
    },

    deleteMetric(metric) {
      this.scenario.custom_metrics = _.without(this.scenario.custom_metrics, metric);
    },

    addLabelsToCustomMetrics(customMetrics) {
      return _.map(customMetrics, (customMetric) => {
        if (customMetric.label) {
          return customMetric;
        } else {
          let referenceMetric = _.find(this.availableMetrics, { id: customMetric.id });
          customMetric.label = referenceMetric ? referenceMetric.label : customMetric.id;
          return customMetric;
        }
      });
    },
  },
  computed: {
    addableMetrics() {
      return _.differenceBy(this.availableMetrics, this.scenario.custom_metrics, "id");
    },
  },
};
</script>

<style scoped>
.icon-selector {
  margin-bottom: 15px;
}

.icon-selector a {
  flex: 1;
}

.icon-selector .icon {
  margin-left: auto;
  margin-right: auto;
}

.icon-selector .caption {
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.custom-metrics-wrapper {
  margin-top: 50px;
}

.custom-metric {
  padding: 15px 10px;
  border-radius: 7px;
}

.custom-metric b {
  font-size: 15px;
}

.metric-header {
  padding-bottom: 5px;
  display: flex;
  align-items: center;
}

.metric-header .metric-label {
  flex: 1;
}

.metric-header .ant-btn {
  display: inline;
  padding: 0;
  width: auto;
}

.icon-wrapper {
  position: relative;
  padding: 0px 30px;
}

.icon-wrapper .anticon {
  position: absolute;
  top: -2px;
  width: 16px;
  height: 16px;
  line-height: 1;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.25);
}

.icon-wrapper .anticon:first-child {
  left: 0;
}

.icon-wrapper .anticon:last-child {
  right: 0;
}

.add-metric {
  margin-top: 20px;
}
</style>
