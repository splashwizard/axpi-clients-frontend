<template>
  <div class="wrapper">
    <div class="stat" v-for="(stat, i) in stats" :key="i">
      <a-statistic style="text-align: right" :title="stat.title" :value="overview['sidebar_stats'][stat.value]" />
    </div>
  </div>
</template>

<script>
export default {
  name: "StatsSidebar",
  props: ["overview"],
  data() {
    return {
      stats: [
        {
          title: "Vendors",
          value: "vendors",
        },
        {
          title: "Vendors Managed",
          value: "vendors_managed",
        },
        {
          title: "Manufacturers",
          value: "manufacturers",
        },
        {
          title: "Spend Classified",
          value: "spend_classified",
        },
        {
          title: "Orders Classified",
          value: "orders_classified",
        },
      ],
    };
  },
};
</script>

<style scoped>
.wrapper {
  padding-right: 20px;
}

.stat {
  margin-bottom: 20px;
}
</style>
