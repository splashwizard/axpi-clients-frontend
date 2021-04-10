<template>
<div>
  <a-button type="link">1W</a-button>
  <a-button type="link">2W</a-button>
  <a-button type="link">1M</a-button>
  <a-button type="link">3M</a-button>
  <a-button type="link" class="selected">1Y</a-button>
  <a-button type="link">MTD</a-button>
  <a-button type="link">QTD</a-button>
  <a-button type="link">YTD</a-button>
  <a-button type="link">All</a-button>
</div>
</template>

<script>
export default {
name: "TimeToolbar",
  props: ['timeOptions']
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