<template>
  <div>
    <!-- Not Loaded -->
    <div v-if="!overview">
      <a-spin v-if="isLoading"></a-spin>
      <h2 v-else>Not loaded...</h2>
    </div>
    <!-- / Not Loaded -->

    <!-- Loaded -->
    <div v-if="overview">
      <!-- Header -->
      <a-row class="header" :gutter="20">
        <a-col :span="12">
          <h2>Total Spend</h2>
          <total-spend :overview="overview"></total-spend>
        </a-col>
        <a-col :span="12">
          <h2>Total Classified Spend</h2>
          <total-classified-spend :overview="overview"></total-classified-spend>
        </a-col>
      </a-row>
      <!-- / Header -->

      <!-- Body -->
      <div class="body">
        <h2>Classified Vendor Spend</h2>

        <a-card>
          <a-row type="flex" :gutter="20">
            <a-col :span="20">
              <classified-vendor-spend :overview="overview"></classified-vendor-spend>
            </a-col>
            <a-col :span="4">
              <div class="sidebar-wrapper">
                <stats-sidebar :overview="overview"></stats-sidebar>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </div>
      <!-- / Body -->
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import axios from "axios";
import TotalSpend from "./MatcherOverview/TotalSpend";
import TotalClassifiedSpend from "./MatcherOverview/TotalClassifiedSpend";
import ClassifiedVendorSpend from "./MatcherOverview/ClassifiedVendorSpend";
import StatsSidebar from "./MatcherOverview/StatsSidebar";

export default {
  name: "MatcherOverview",
  components: {
    ClassifiedVendorSpend,
    TotalClassifiedSpend,
    TotalSpend,
    StatsSidebar,
  },
  created() {
    this.fetch();
  },
  data() {
    return {
      overview: null,
      isLoading: false,
    };
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      vm.overview = null;
      axios
        .get(window.API_BASE + "/matcher/overview")
        .then((r) => {
          vm.overview = r.data;
          vm.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          this.$message.error("Error loading overview");
        });
    },
  },
};
</script>

<style scoped>
.header {
  padding-top: 5px;
}

.body {
  padding-top: 30px;
}

.sidebar-wrapper {
  border-left: 1px solid #eee;
  height: 100%;
}
</style>
