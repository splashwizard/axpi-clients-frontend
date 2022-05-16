<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-left">
      <a-button
        @click.prevent="setTimeDurationFilter('1W')"
        type="link"
        :class="{ selected: isTimeDurationSelected('1W') }"
        >1W
      </a-button>
      <a-button
        @click.prevent="setTimeDurationFilter('2W')"
        type="link"
        :class="{ selected: isTimeDurationSelected('2W') }"
        >2W
      </a-button>
      <a-button
        @click.prevent="setTimeDurationFilter('1M')"
        type="link"
        :class="{ selected: isTimeDurationSelected('1M') }"
        >1M
      </a-button>
      <a-button
        @click.prevent="setTimeDurationFilter('3M')"
        type="link"
        :class="{ selected: isTimeDurationSelected('3M') }"
        >3M
      </a-button>
      <a-button
        @click.prevent="setTimeDurationFilter('1Y')"
        type="link"
        :class="{ selected: isTimeDurationSelected('1Y') }"
        >1Y
      </a-button>
      <a-button
        @click.prevent="setTimeDurationFilter('MTD')"
        type="link"
        :class="{ selected: isTimeDurationSelected('MTD') }"
        >MTD
      </a-button>
      <a-button
        @click.prevent="setTimeDurationFilter('QTD')"
        type="link"
        :class="{ selected: isTimeDurationSelected('QTD') }"
        >QTD
      </a-button>
      <a-button
        @click.prevent="setTimeDurationFilter('YTD')"
        type="link"
        :class="{ selected: isTimeDurationSelected('YTD') }"
        >YTD
      </a-button>
      <a-button
        @click.prevent="setTimeDurationFilter(null)"
        type="link"
        :class="{ selected: isTimeDurationSelected(null) }"
        >All
      </a-button>
    </div>
    <div class="toolbar-right">
      <a-range-picker v-model="timeOptions.dateRange" />
    </div>
  </div>
</template>

<script>
const moment = require("moment");
export default {
  name: "TimeToolbar",
  props: ["timeOptions"],
  methods: {
    setTimeDurationFilter(period) {
      this.timeOptions.duration = period;
      this.$emit("filter-updated");

      if (period === "1Y") {
        this.timeOptions.dateRange = [moment("2020-04-01"), moment("2021-04-30")];
      }

      if (period === "YTD") {
        this.timeOptions.dateRange = [moment("2021-01-01"), moment("2021-04-30")];
      }
    },

    isTimeDurationSelected(period) {
      return this.timeOptions.duration === period;
    },
  },
};
</script>

<style scoped>
.ant-btn-link {
  color: rgba(0, 0, 0, 0.5);
}

.selected {
  color: rgb(55, 53, 179);
  font-weight: bold;
}

.toolbar-wrapper {
  display: flex;
}

.toolbar-left {
  flex: 1;
}

.toolbar-right {
  flex-shrink: 1;
}
</style>
