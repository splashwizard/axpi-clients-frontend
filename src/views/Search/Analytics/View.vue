<template>
  <div>
    <div class="controls">
      <a-select default-value="4_weeks" style="width: 120px" @change="handleChangeOption">
        <a-select-option value="day">
          Last day
        </a-select-option>
        <a-select-option value="week">
          Last week
        </a-select-option>
        <a-select-option value="4_weeks">
          Last 4 weeks
        </a-select-option>
      </a-select>
      <a-range-picker @change="onChangeStartPeriod" :value="startperiod" />
      <h4 class="controls-label">compared to</h4>
      <a-range-picker @change="onChangeEndPeriod" :value="endperiod" />
    </div>
    <a-card class="mt-2">
      <a-card-grid style="width:33.33%" v-for="item of chartData" :key="item.label">
        <card :title="item.label" :total="item.total" :percent="item.percent" />
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>


import Card from "./Card";
export default {
  name: "AnalyticsView",
  props: [],
  components: { Card },
  data() {
    return {
      option: '4_weeks',
      chartData: [
        {
          label: 'Total Users',
          total: ['$1000', '$1029'],
          percent: 6.7
        },
        {
          label: 'Total Searches',
          total: ['$1000', '$1029'],
          percent: 4.2
        },
        {
          label: 'No Results Rate',
          total: ['$1000', '$1029'],
          percent: -1.9
        },
        {
          label: 'Click Rate',
          total: ['$1000', '$1029'],
          percent: 6.7
        },
        {
          label: 'Conversion Rate',
          total: ['$1000', '$1029'],
          percent: 4.2
        },
        {
          label: 'No Clicks Rate',
          total: ['$1000', '$1029'],
          percent: -1.9
        },
      ],
      startperiod: [],
      endperiod: []
    }
  },
  methods: {
    handleChangeOption(option) {
      this.option = option;
    },
    onChangeStartPeriod(date) {
      this.startperiod = date;
    },
    onChangeEndPeriod(date) {
      this.endperiod = date;
    },
  }
}
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