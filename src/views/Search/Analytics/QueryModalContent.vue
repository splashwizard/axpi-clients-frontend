<template>
  <div>
    <div class="d-flex">
      <div style="flex: 4" class="d-flex">
        <div class="search-wrapper p-2">
          <a-icon type="search" />
        </div>
        <div>
          <h2 class="m-0">jacket</h2>
          <h4 class="text-gray">19022 searches</h4>
        </div>
      </div>
      <div style="flex: 2">
        <h2 class="m-0">8.35</h2>
        <h4 class="text-gray">Avg. click position</h4>
      </div>
      <div style="flex: 1">
        <h2 class="m-0">1.46%</h2>
        <h4 class="text-gray">CTR</h4>
      </div>
      <div style="flex: 1">
        <h2 class="m-0">14.67%</h2>
        <h4 class="text-gray">Conversion</h4>
      </div>
    </div>
    <a-card class="mt-2">
      <div class="relative" style="width: 100%">
        <h3 class="m-0" style="padding-top: 6px">Click Position</h3>
        <p>Positions of the clicks performed on results displayed for "jacket"</p>
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
    </a-card>
    <a-card :bodyStyle="{ padding: 0 }" class="mt-2">
      <div class="p-6">
        <a-row type="flex" justify="space-between" class="rule-row">
          <h4>Popular results for this search</h4>
          <div class="d-flex">
            <p class="m-0 pr-2">Show %</p>
            <a-switch :checked="showPercent" @click="triggerPercent">
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </div>
        </a-row>
      </div>
      <query-table :data="queryData" :showPercent="showPercent" :handleClickQuery="handleClickQuery" />
    </a-card>
  </div>
</template>

<script>
import QueryTable from "./QueryTable";

const queryData = [
  {
    id: 1,
    result: "Bully-Leather Jacket",
    impressions: 19022,
    clicks: 11,
    conversions: 131,
    CTR: 5.4,
    CVR: 2.9,
  },
  {
    id: 2,
    result: "Invita-Casual Jacket",
    impressions: 19022,
    clicks: 11,
    conversions: 131,
    CTR: 10.4,
    CVR: 20.1,
  },
];
export default {
  name: "QueryModalContent",
  props: [],
  components: { QueryTable },
  data() {
    return {
      percentChar: "4.2",
      clickKeys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11 - 20", "21+"],
      percentAvg: 5.04,
      queryData: [],
      showPercent: false,
    };
  },
  created() {
    this.queryData = queryData;
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
    triggerPercent() {
      this.showPercent = !this.showPercent;
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
  height: 70px;
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
  height: 70px;
  background-color: gray;
  margin: 0;
}

.search-wrapper {
  background-color: #eeeeee;
  padding: 12px 16px;
  margin-right: 8px;
}
</style>
