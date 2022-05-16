<template>
  <div class="graph-container">
    <div v-if="isLoading" class="loading-screen">
      <a-spin />
    </div>
    <v-chart v-else :forceFit="true" :height="height" :data="graphData" :scale="scale" renderer="svg">
      <v-tooltip :showTitle="false" :crosshairs="{ type: 'cross' }" />
      <v-axis dataKey="total_co2e" :title="{ text: 'CO2e' }" />
      <v-axis dataKey="water" :title="{ text: 'Water' }" />
      <!--      <v-legend dataKey="specification"-->
      <!--                :show="false" />-->
      <v-point
        position="total_co2e*water"
        :color="pointColor"
        :size="pointSize"
        :vStyle="pointStyle"
        tooltip="specification*supplier*total_co2e*water"
        shape="circle"
      />
    </v-chart>
  </div>
</template>

<script>
import { Global } from "viser-vue";
import axios from "axios";
import { mapGetters } from "vuex";

const scale = [
  {
    dataKey: "total_co2e",
    alias: "CO2e",
    formatter: (val) => {
      if (val === 0) {
        return 0;
      }
      return val + " kg";
    },
  },
  {
    dataKey: "water",
    alias: "Water",
    formatter: (val) => {
      if (val === 0) {
        return 0;
      }
      return val + " kg";
    },
  },
  {
    dataKey: "supplier",
    alias: "Supplier",
  },
  {
    dataKey: "specification",
    alias: "Specification",
  },
];

export default {
  name: "WhichSuppliersAreMostEnvironmentallyFriendly",
  props: ["optimisationId"],
  data() {
    return {
      isLoading: false,
      data: null,

      height: 500,
      scale,

      pointColor: ["specification", (val) => this.colorMap[val]],
      pointSize: ["expected_price", [4, 40]],
      pointStyle: [
        "continent",
        {
          lineWidth: 1,
          strokeOpacity: 1,
          fillOpacity: 0.3,
          opacity: 0.65,
          stroke: (val) => this.colorMap[val],
        },
      ],
    };
  },
  computed: {
    ...mapGetters("optimisationAnalyticsManager", {
      filterBySupplier: "filterBySupplier",
      selectedSupplier: "selectedSupplier",
      filterBySpecification: "filterBySpecification",
      selectedSpecification: "selectedSpecification",
    }),

    colorMap() {
      return {
        Asia: Global.colors[0],
        Americas: Global.colors[1],
        Europe: Global.colors[2],
        Oceania: Global.colors[3],
      };
    },

    graphData() {
      return this.data;
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;

      let params = {
        include_pricing_data: true,
      };

      if (this.filterBySupplier && this.selectedSupplier) {
        params["supplier_id"] = this.selectedSupplier.id;
      }

      if (this.filterBySpecification && this.selectedSpecification) {
        params["optimisation_specification_id"] = this.selectedSpecification.id;
      }

      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisationId + "/environmental-analytics", params)
        .then((r) => {
          vm.isLoading = false;
          vm.data = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading environmental analytics");
        });
    },
  },
  watch: {
    dateRange() {
      this.fetch();
    },
    filterBySupplier() {
      this.fetch();
    },
    selectedSupplier() {
      this.fetch();
    },
    filterBySpecification() {
      this.fetch();
    },
    selectedSpecification() {
      this.fetch();
    },
  },
};
</script>

<style scoped>
.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}
</style>
