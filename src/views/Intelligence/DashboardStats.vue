<template>
  <div>
    <!-- Loading -->
    <div v-if="isLoading" class="loader">
      <a-spin></a-spin>
      <span class="loader-description">Loading stats...</span>
    </div>
    <!-- / Loading -->

    <!-- Loaded -->
    <div v-if="!isLoading && stats">
      <!--      <a-row :gutter="20">-->
      <!--        &lt;!&ndash; Overview &ndash;&gt;-->
      <!--        <a-col :span="12">-->
      <!--          <a-descriptions size="middle" bordered title="Overview" :column="1">-->
      <!--            <a-descriptions-item label="Suppliers">-->
      <!--              {{ stats['number_of_suppliers'] }}-->
      <!--            </a-descriptions-item>-->
      <!--            <a-descriptions-item label="Business Units">-->
      <!--              {{ stats['number_of_organisational_units'] }}-->
      <!--            </a-descriptions-item>-->
      <!--            <a-descriptions-item label="Categories">-->
      <!--              {{ stats['number_of_categories'] }}-->
      <!--            </a-descriptions-item>-->
      <!--          </a-descriptions>-->
      <!--        </a-col>-->
      <!--        &lt;!&ndash; / Overview &ndash;&gt;-->
      <!--        &lt;!&ndash; Spend &ndash;&gt;-->
      <!--        <a-col :span="12">-->
      <!--          <a-descriptions size="middle" bordered title="Spend" :column="1">-->
      <!--            <a-descriptions-item label="Last 12 Months"-->
      <!--            >$100M-->
      <!--            </a-descriptions-item-->
      <!--            >-->
      <!--            <a-descriptions-item label="Spend Managed">95%</a-descriptions-item>-->
      <!--            <a-descriptions-item label="Spend Managed"-->
      <!--            >$300M-->
      <!--            </a-descriptions-item-->
      <!--            >-->
      <!--          </a-descriptions>-->
      <!--        </a-col>-->
      <!--        &lt;!&ndash; / Spend &ndash;&gt;-->
      <!--        &lt;!&ndash;        &lt;!&ndash; Demand &ndash;&gt;&ndash;&gt;-->
      <!--        &lt;!&ndash;        <a-col :span="8">&ndash;&gt;-->
      <!--        &lt;!&ndash;          <a-descriptions size="middle" bordered title="Spend" :column="1">&ndash;&gt;-->
      <!--        &lt;!&ndash;            <a-descriptions-item label="Last 12 Months"&ndash;&gt;-->
      <!--        &lt;!&ndash;            >$100M&ndash;&gt;-->
      <!--        &lt;!&ndash;            </a-descriptions-item&ndash;&gt;-->
      <!--        &lt;!&ndash;            >&ndash;&gt;-->
      <!--        &lt;!&ndash;            <a-descriptions-item label="Spend Managed">95%</a-descriptions-item>&ndash;&gt;-->
      <!--        &lt;!&ndash;            <a-descriptions-item label="Spend Managed"&ndash;&gt;-->
      <!--        &lt;!&ndash;            >$300M&ndash;&gt;-->
      <!--        &lt;!&ndash;            </a-descriptions-item&ndash;&gt;-->
      <!--        &lt;!&ndash;            >&ndash;&gt;-->
      <!--        &lt;!&ndash;          </a-descriptions>&ndash;&gt;-->
      <!--        &lt;!&ndash;        </a-col>&ndash;&gt;-->
      <!--        &lt;!&ndash;        &lt;!&ndash; / Demand &ndash;&gt;&ndash;&gt;-->
      <!--      </a-row>-->

      <a-row :gutter="20">
        <a-col :span="6">
          <a-card>
            <a-statistic title="Number of suppliers" :value="stats['number_of_suppliers']">
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic title="Number of business units" :value="stats['number_of_organisational_units']">
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic title="Number of categories" :value="stats['number_of_categories']">
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic title="Total spend"
                         :precision="0"
                         prefix="$"
                         :value="stats['total_spend']">
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "DashboardStats",
  data() {
    return {
      isLoading: false,
      stats: []
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/intelligence/stats').then(r => {
        vm.isLoading = false;
        vm.stats = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.stats = null;
        vm.$message.error('Error loading stats');
      });
    }
  }
}
</script>

<style scoped>
.loader {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.loader-description {
  margin-left: 10px;
}
</style>