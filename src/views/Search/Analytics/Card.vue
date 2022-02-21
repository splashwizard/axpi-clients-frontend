<template>
  <div>
    <div class="d-flex">
      <h3 class="m-0">{{title}}</h3>
      <div :class="percentChar >= 0 ? 'status-success text-bold' : 'status-warning text-bold'">{{percentChar}}%</div>
    </div>
    <div class="d-flex justify-between">
      <h2 class="m-0">$4542345</h2>
      <h2 class="text-small m-0 text-gray">$4062123</h2>
    </div>
    <line-chart :chartdata="chartData" style="height: 100px"/>
  </div>
</template>

<script>


import LineChart from "./LineChart";
export default {
  name: "AnalyticsView",
  props: ["title", "percent"],
  components: { LineChart },
  data() {
    return {
      option: '4_weeks',
      startperiod: [],
      endperiod: [],
    }
  },
  computed: {
    percentChar() {
      if(this.percent > 0) return '+' + this.percent;
      else if(this.percent < 0) return this.percent;
      return this.percent;
    }
  },
  created () {
    this.fillData()
  },
  methods: {
    fillData () {
      this.chartData = {
        labels: ['Jul 31', '', '', '', '', 'Aug 29'],
        datasets: [
          {
            label: 'Last 4 week',
            backgroundColor: '#ffffff00',
            borderColor: '#777777',
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(),this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            tension: 0.1
          },
          {
            label: 'Data Two',
            backgroundColor: '#ffffff00',
            borderColor: '#9999ff',
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(),this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
            tension: 0.1
          }
        ]
      };
    },
    getRandomInt () {
      return Math.floor(Math.random() * 5)
    }
  }
}
</script>

<style scoped lang="scss">
  .text-small {
    font-size: 20px;
  }
</style>