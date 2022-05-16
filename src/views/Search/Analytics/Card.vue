<template>
  <div>
    <div class="d-flex">
      <h3 class="m-0">{{ title }}</h3>
      <div
        v-if="endperiod.length !== 0"
        :class="percentChar >= 0 ? 'status-success text-bold' : 'status-warning text-bold'"
      >
        {{ percentChar }}%
      </div>
    </div>
    <div class="d-flex justify-between">
      <h2 class="m-0">${{ formatNumber(4542345) }}</h2>
      <h2 v-if="endperiod.length !== 0" class="text-small m-0 text-gray">${{ formatNumber(4062123) }}</h2>
    </div>
    <line-chart :chartdata="charts" style="height: 100px" />
    <div class="d-flex justify-between">
      <h5 class="m-0 text-gray">{{ startDate }}</h5>
      <h5 class="m-0 text-gray">{{ endDate }}</h5>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { numberWithCommas } from "../../../helpers/formatter";
import LineChart from "./LineChart";

export default {
  name: "AnalyticsView",
  props: ["title", "percent", "startperiod", "endperiod"],
  components: { LineChart },
  data() {
    return {
      option: "4_weeks",
    };
  },
  computed: {
    percentChar() {
      if (this.percent > 0) return "+" + this.percent;
      else if (this.percent < 0) return this.percent;
      return this.percent;
    },
    startDate() {
      return moment(this.startperiod[0]).format("MMM DD");
    },
    endDate() {
      return moment(this.startperiod[1]).format("MMM DD");
    },
    charts() {
      return {
        labels: this.chartData.labels,
        datasets: this.chartData.datasets.filter((item) => {
          return (
            (item.key === "start" && this.startperiod.length > 0) || (item.key === "end" && this.endperiod.length > 0)
          );
        }),
      };
    },
  },
  created() {
    this.fillData();
  },
  methods: {
    formatNumber(value) {
      return numberWithCommas(value);
    },
    fillData() {
      this.chartData = {
        labels: ["", "", "", "", "", ""],
        datasets: [
          {
            key: "start",
            label: "Last period",
            backgroundColor: "#ffffff00",
            borderColor: "rgb(191,195,205)",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
            tension: 0.1,
          },
          {
            key: "end",
            label: "Previous period",
            backgroundColor: "#ffffff00",
            borderColor: "rgb(147,159,222)",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
            tension: 0.1,
          },
        ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * 5);
    },
  },
};
</script>

<style scoped lang="scss">
.text-small {
  font-size: 20px;
}
</style>
