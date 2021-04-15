<template>
<div>
  <a-button @click.prevent="setTimeDurationFilter('1W')" type="link" :class="{'selected': isTimeDurationSelected('1W')}">1W</a-button>
  <a-button @click.prevent="setTimeDurationFilter('2W')" type="link" :class="{'selected': isTimeDurationSelected('2W')}">2W</a-button>
  <a-button @click.prevent="setTimeDurationFilter('1M')" type="link" :class="{'selected': isTimeDurationSelected('1M')}">1M</a-button>
  <a-button @click.prevent="setTimeDurationFilter('3M')" type="link" :class="{'selected': isTimeDurationSelected('3M')}">3M</a-button>
  <a-button @click.prevent="setTimeDurationFilter('1Y')" type="link" :class="{'selected': isTimeDurationSelected('1Y')}">1Y</a-button>
  <a-button @click.prevent="setTimeDurationFilter('MTD')" type="link" :class="{'selected': isTimeDurationSelected('MTD')}">MTD</a-button>
  <a-button @click.prevent="setTimeDurationFilter('QTD')" type="link" :class="{'selected': isTimeDurationSelected('QTD')}">QTD</a-button>
  <a-button @click.prevent="setTimeDurationFilter('YTD')" type="link" :class="{'selected': isTimeDurationSelected('YTD')}">YTD</a-button>
  <a-button @click.prevent="setTimeDurationFilter(null)" type="link" :class="{'selected': isTimeDurationSelected(null)}">All</a-button>
</div>
</template>

<script>
export default {
name: "TimeToolbar",
  props: ['timeOptions'],
  methods: {
    setTimeDurationFilter(period) {
      this.timeOptions.duration = period;
      this.$emit('filter-updated');
    },

    isTimeDurationSelected(period) {
      return this.timeOptions.duration === period;
    }
  }
}
</script>

<style scoped>
.ant-btn-link {
  color: rgba(0, 0, 0, 0.5);
}

.selected {
  color: rgb(55, 53, 179);
  font-weight: bold;
}
</style>