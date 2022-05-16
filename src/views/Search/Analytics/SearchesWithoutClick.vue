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
    <a-card :bodyStyle="{ padding: 0 }" class="mt-2">
      <div class="p-6">
        <a-row type="flex" justify="space-between" class="rule-row">
          <h4>Searches without Clicks</h4>
          <a-input
            class="search-term"
            :value="searchTerm"
            @change="(e) => changeSearchTerm(e.target.value)"
            placeholder="Search for a query"
          >
            <a-icon slot="prefix" type="search" />
          </a-input>
        </a-row>
      </div>
      <searches-without-click-table :data="tableData" :compared="endperiod.length > 0" />
    </a-card>
  </div>
</template>

<script>
import SearchesWithoutClickTable from "./SearchesWithoutClickTable";

const tableData = [
  // { id: 1, query: '<empty search>', count: 17, countpercent: 6, CTR: 0.5, CVR: 2, click_position: 0, total_searches: 100, opportunities: '-'},
  // { id: 32, query: '<empty search>', count: 8, countpercent: -50, CTR: 3, CVR: -5.8, click_position: 1, total_searches: 50, opportunities: '-'}
];

export default {
  name: "SearchesWithoutClick",
  props: [],
  components: { SearchesWithoutClickTable },
  data() {
    return {
      option: "4_weeks",
      chartData: [],
      startperiod: [],
      endperiod: [],
      searchTerm: "",
      tableData: [],
    };
  },
  created() {
    this.tableData = tableData;
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
    changeSearchTerm(value) {
      this.searchTerm = value;
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

.search-term {
  width: 190px;
}
</style>
