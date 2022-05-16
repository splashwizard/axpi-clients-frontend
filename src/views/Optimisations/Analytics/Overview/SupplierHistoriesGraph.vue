<template>
  <div class="graph-container supplier-histories-graph">
    <div class="toolbar">
      <div class="toolbar-col">
        <a-select v-model="metric">
          <a-select-option :value="option.value" v-for="(option, i) in metricOptions" :key="i">
            {{ option.label }}
          </a-select-option>
        </a-select>
      </div>
      <div class="toolbar-col">
        <a-range-picker v-model="dateRange" />
      </div>
    </div>

    <div v-if="isLoading" class="loading-screen">
      <a-spin />
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
      <v-tooltip :htmlContent="htmlContent" :shared="true"></v-tooltip>
      <v-interval position="supplier*value" opacity="1"> </v-interval>
      <v-axis dataKey="supplier" :title="{ text: 'Supplier' }"> </v-axis>
      <v-axis dataKey="value" :title="{ text: selectedMetric.label }"> </v-axis>
    </v-chart>
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../../../mixins/Orders";
import { mapGetters } from "vuex";

const _ = require("lodash");

const METRIC_OPTIONS = [
  {
    label: "Number of past orders",
    value: "order_count",
  },
  {
    label: "Total spend",
    value: "total_spend",
  },
];

export default {
  name: "SupplierHistoriesGraph",
  mixins: [Orders],
  data() {
    return {
      isLoading: true,
      data: null,
      height: 449,
      metric: "order_count",
      metricOptions: METRIC_OPTIONS,
      dateRange: null,
    };
  },
  props: ["optimisationId"],
  computed: {
    ...mapGetters("optimisationAnalyticsManager", {
      filterBySupplier: "filterBySupplier",
      selectedSupplier: "selectedSupplier",
    }),

    selectedMetric() {
      return _.find(this.metricOptions, {
        value: this.metric,
      });
    },
    graphData() {
      if (!this.data) {
        return [];
      }

      let sourceData = [];
      _.each(this.data, (specData) => {
        let params = {
          supplier: specData.supplier.name.substring(0, 5) + "...",
          supplier_full: specData.supplier.name,
          value: specData[this.metric],
        };
        sourceData.push(params);
      });
      sourceData = _.uniqBy(sourceData, "supplier");
      return _.sortBy(sourceData, "value");
    },
    scale() {
      return [
        {
          dataKey: "supplier",
          type: "cat",
          // values: _.map(this.data, 'supplier.name'),
        },
        {
          dataKey: "value",
          formatter: (val) => {
            if (this.metric == "total_spend") {
              return this.formatCost({ cost: val, cost_currency: "USD" });
            }
            return val;
          },
        },
      ];
    },
  },
  created() {
    this.fetch();
  },
  watch: {
    dateRange() {
      this.fetch();
    },
    filterBySupplier() {
      this.fetch();
    },
    selectedSupplier() {
      this.fetch();
    },
  },
  methods: {
    htmlContent(title, items) {
      var html = '<div class="g2-tooltip">';
      var titleDom =
        '<div class="g2-tooltip-title" style="margin-bottom: 4px;">' + items[0].point._origin.supplier_full + "</div>";
      var listDom = '<ul class="g2-tooltip-list">';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        let value = item.point._origin.value;
        if (this.metric == "total_spend") {
          value = this.formatCost({ cost: value, cost_currency: "USD" });
        }
        var itemDom =
          "<li data-index={index}>" +
          '<span style="background-color:' +
          item.color +
          ';width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
          (this.selectedMetric ? this.selectedMetric.label : "value") +
          '<span class="g2-tooltip-value">' +
          value +
          "</span>" +
          "</li>";
        listDom += itemDom;
      }
      listDom += "</ul>";
      return html + titleDom + listDom + "</div>";
    },

    fetch() {
      let vm = this;
      vm.isLoading = true;

      let params = {};

      if (this.dateRange && this.dateRange.length === 2) {
        params["start_date"] = window.moment(this.dateRange[0]).format("YYYY-MM-DD");
        params["end_date"] = window.moment(this.dateRange[1]).format("YYYY-MM-DD");
      }

      if (this.filterBySupplier && this.selectedSupplier) {
        params["supplier_id"] = this.selectedSupplier.id;
      }

      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisationId + "/supplier-analytics", params)
        .then((r) => {
          vm.isLoading = false;
          vm.data = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading supplier analytics");
        });
    },
  },
};
</script>

<style lang="scss">
.supplier-histories-graph {
  .loading-screen {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 70px;
  }

  .toolbar {
    display: flex;
    flex-direction: row;
  }

  .toolbar .ant-select {
    width: 100%;
  }

  .toolbar .toolbar-col {
    flex: 1;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 8px;
    padding-bottom: 10px;
  }

  .g2-tooltip {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 3px;
    color: rgb(87, 87, 87);
    font-size: 12px;
    line-height: 20px;
    padding: 10px 10px 6px 10px;
  }

  .g2-tooltip-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .g2-tooltip-value {
    margin-left: 30px;
    display: inline;
    float: right;
  }

  .g2-tooltip-statistic {
    font-size: 14px;
    padding-bottom: 10px;
    margin-top: 10px;
    list-style-type: none;
  }

  .g2-tooltip-statistic-value {
    font-weight: "bold";
    display: "inline-block";
    float: right;
    margin-left: 30px;
  }
}
</style>
