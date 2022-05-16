<template>
  <div class="mt-2">
    <div class="relative" style="width: 100%">
      <div class="d-flex">
        <h4 class="m-0" style="padding-top: 6px">Click Position</h4>
        <div :class="percentChar >= 0 ? 'status-success text-bold' : 'status-warning text-bold'">
          {{ percentChar }}%
        </div>
      </div>
      <p>
        Average position of the clicks<br />
        performed on the search results.<br />
        Smaller values are better
      </p>
      <div class="absolute top-0 right-0 d-flex">
        <div class="average-label">
          <h4 class="m-0">avg.&nbsp;<span>5.04</span></h4>
          <p>Click position on {{ formatNumber(clickCount) }} clicks</p>
        </div>
        <div class="average-label">
          <h4 class="m-0 text-gray">avg.&nbsp;<span>5.04</span></h4>
          <p class="text-gray">Click position on {{ formatNumber(prevClickCount) }} clicks</p>
        </div>
      </div>
    </div>
    <div class="d-flex" style="width: 100%; position: relative">
      <div v-for="key in clickKeys" :key="key" class="click-card" style="text-align: center">
        <div class="ch-100" :class="clickGradient(key)"></div>
        <h5 class="mt-2">{{ key }}</h5>
      </div>
      <a-tooltip>
        <template slot="title"> avg. {{ percentAvg }} </template>
        <div style="padding: 0 12px; position: absolute; top: 0" :style="lineStyle">
          <div class="click-line"></div>
        </div>
      </a-tooltip>
    </div>
    <h5>Jan 4th, 2022 to Jan 9th, 2022</h5>
  </div>
</template>

<script>
import { numberWithCommas } from "../../../helpers/formatter";

export default {
  name: "ViewClickSection",
  props: ["data"],
  components: {},
  data() {
    return {
      percentChar: "4.2",
      clickKeys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11 - 20", "21+"],
      percentAvg: 10.5,
      clickCount: 55747,
      prevClickCount: 33468,
    };
  },
  computed: {
    lineStyle() {
      let leftPercent;
      if (this.percentAvg < 11) leftPercent = (100 / 12) * (this.percentAvg - 1);
      else if (this.percentAvg >= 11 && this.percentAvg < 21)
        leftPercent = (100 / 12) * 10 + (100 / 12 / 10) * (this.percentAvg - 11);
      else leftPercent = (100 / 12) * 11.5;
      return `left: calc(${leftPercent}% - 12px)`;
    },
  },
  methods: {
    formatNumber(value) {
      return numberWithCommas(value);
    },
    clickGradient(key) {
      if (key === "1") return "bg-orange-100";
      if (key === "2" || key === "11 - 20") return "bg-orange-200";
      if (key === "3") return "bg-orange-300";
      if (key === "21+") return "bg-white";
      return "bg-orange-400";
    },
  },
};
</script>

<style scoped lang="scss">
.ch-100 {
  height: 100px;
}
.click-card {
  flex: 1;
  margin-right: 2px;
}
.average-label {
  width: 220px;
  text-align: right;
  span {
    font-size: 22px;
  }
}
.bg-orange-100 {
  background-color: rgb(223, 143, 105);
}

.bg-orange-200 {
  background-color: rgb(234, 184, 158);
}

.bg-orange-300 {
  background-color: rgb(249, 236, 227);
}

.bg-orange-400 {
  background-color: rgb(251, 245, 243);
}

.bg-white {
  background-color: white;
}

.click-line {
  width: 2px;
  height: 100px;
  background-color: gray;
}
</style>
