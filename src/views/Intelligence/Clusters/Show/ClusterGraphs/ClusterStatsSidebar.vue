<template>
  <div class="wrapper">
    <div v-if="isLoading" style="text-align: center">
      <a-spin></a-spin>
    </div>
    <div class="stat" v-for="(stat, i) in statsToShow" :key="i">
      <a-statistic
        v-if="!isLoading"
        style="text-align: right"
        :title="stat.title"
        :value="stats[stat.value]"
        :precision="stat['precision'] ? stat['precision'] : 0"
        :prefix="stat['prefix'] ? stat['prefix'] : null"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  props: ["clusterId"],
  data() {
    return {
      isLoading: false,
      stats: null,
      statsToShow: [
        {
          title: "Orders",
          value: "number_of_orders",
        },
        {
          title: "Spend",
          value: "spend",
          precision: 2,
          prefix: "$",
        },
        {
          title: "Saved",
          value: "saved",
          precision: 2,
          prefix: "$",
        },
        {
          title: "Savings Potential",
          value: "savings_potential_next_12_months",
          precision: 2,
          prefix: "$",
        },
      ],
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    ...mapGetters("clusterViewer", {
      startDate: "startDate",
      endDate: "endDate",
    }),
  },
  watch: {},
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;

      let params = {};
      if (this.startDate) {
        params["start_date"] = this.startDate;
      }
      if (this.endDate) {
        params["end_date"] = this.endDate;
      }

      axios
        .post(window.API_BASE + "/intelligence/clusters/" + this.clusterId + "/stats", params)
        .then((r) => {
          vm.isLoading = false;
          vm.stats = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading cluster stats");
        });
    },
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
