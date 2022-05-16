<template>
  <div>
    <div class="controls">
      <a-select default-value="week" style="width: 120px" @change="handleChangeOption">
        <a-select-option value="year"> Last year </a-select-option>
        <a-select-option value="month"> Last 3 months </a-select-option>
        <a-select-option value="week"> Last 4 weeks </a-select-option>
        <a-select-option value="day"> Last 7 days </a-select-option>
      </a-select>
      <a-range-picker @change="onChangeStartPeriod" :value="startperiod" />
      <h4 class="controls-label">compared to</h4>
      <a-range-picker @change="onChangeEndPeriod" :value="endperiod" />
    </div>
    <a-card class="mt-2">
      <a-card-grid style="width: 33.33%" v-for="item of chartData" :key="item.label" :hoverable="false">
        <card
          :title="item.label"
          :startperiod="startperiod"
          :endperiod="endperiod"
          :total="item.total"
          :percent="item.percent"
        />
      </a-card-grid>
    </a-card>
    <view-click-section :data="clickData" />
  </div>
</template>

<script>
import Card from "./Card";
import ViewClickSection from "./ViewClickSection";
import moment from "moment";

const exampleData = [
  {
    label: "Total Users",
    total: ["$1000", "$1029"],
    percent: 6.7,
  },
  {
    label: "Total Searches",
    total: ["$1000", "$1029"],
    percent: 4.2,
  },
  {
    label: "No Results Rate",
    total: ["$1000", "$1029"],
    percent: -1.9,
  },
  {
    label: "Click Rate",
    total: ["$1000", "$1029"],
    percent: 6.7,
  },
  {
    label: "Conversion Rate",
    total: ["$1000", "$1029"],
    percent: 4.2,
  },
  {
    label: "No Clicks Rate",
    total: ["$1000", "$1029"],
    percent: -1.9,
  },
];

export default {
  name: "AnalyticsView",
  props: [],
  components: { Card, ViewClickSection },
  data() {
    return {
      option: "4_weeks",
      chartData: [],
      startperiod: [],
      endperiod: [],
      clickData: null,
    };
  },
  created() {
    this.handleChangeOption("week");
    this.chartData = exampleData;
  },
  methods: {
    handleChangeOption(option) {
      this.option = option;
      if (option === "year") {
        this.startperiod = [moment().subtract(1, "year").add(1, "day"), moment()];
        this.endperiod = [moment().subtract(2, "years").add(1, "day"), moment().subtract(1, "year")];
      } else if (option === "month") {
        this.startperiod = [moment().subtract(3, "months").add(1, "day"), moment()];
        this.endperiod = [moment().subtract(6, "months").add(1, "day"), moment().subtract(3, "months")];
      } else if (option === "week") {
        this.startperiod = [moment().subtract(4, "weeks").add(1, "day"), moment()];
        this.endperiod = [moment().subtract(8, "weeks").add(1, "day"), moment().subtract(4, "weeks")];
      } else if (option === "day") {
        this.startperiod = [moment().subtract(7, "days").add(1, "day"), moment()];
        this.endperiod = [moment().subtract(14, "days").add(1, "day"), moment().subtract(7, "days")];
      }
    },
    onChangeStartPeriod(date) {
      this.startperiod = date;
    },
    onChangeEndPeriod(date) {
      this.endperiod = date;
    },
  },
};
</script>

<style scoped lang="scss">
.controls {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.controls-label {
  padding: 0 4px;
}
</style>
