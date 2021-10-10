<template>
  <div>
    <!-- Loading -->
    <div v-if="isLoading" class="loader stats-wrapper">
      <a-spin></a-spin>
      <span class="loader-description">Loading stats...</span>
    </div>
    <!-- / Loading -->

    <!-- Loaded -->
    <div v-if="!isLoading && stats" class="stats-wrapper">
      <a-row :gutter="20">
        <!-- Overview -->
        <a-col :span="6">
          <table class="axpi-basic-table">
            <thead>
            <tr>
              <th colspan="2">
                <div class="table-header-wrapper">
                  <div class="table-header-left">
                    <b>Data Overview</b><br>
                    Current Data
                  </div>
                  <div class="table-header-right">
                    <a-icon type="database"></a-icon>
                  </div>
                </div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Suppliers</td>
              <td>
                {{ stats['number_of_suppliers'] }}
              </td>
            </tr>
            <tr>
              <td>Business Units</td>
              <td>
                {{ stats['number_of_organisational_units'] }}
              </td>
            </tr>
            <tr>
              <td>Categories</td>
              <td>
                {{ stats['number_of_categories'] }}
              </td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <!-- / Overview -->
        <!-- Spend -->
        <a-col :span="6">
          <table class="axpi-basic-table">
            <thead>
            <tr>
              <th colspan="2">
                <div class="table-header-wrapper">
                  <div class="table-header-left">
                    <b>Spend</b><br>
                    Last 12 Months
                  </div>
                  <div class="table-header-right">
                    <a-icon type="dollar"></a-icon>
                  </div>
                </div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Spend in last 12 months</td>
              <td>
                $100M
              </td>
            </tr>
            <tr>
              <td>Spend Managed</td>
              <td>95%</td>
            </tr>
            <tr>
              <td>Spend Managed</td>
              <td>
                {{ formatCost({cost: stats['total_spend'], cost_currency: 'USD'}) }}
              </td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <!-- / Spend -->
        <!-- Demand -->
        <a-col :span="6">
          <table class="axpi-basic-table">
            <thead>
            <tr>
              <th colspan="2">
                <div class="table-header-wrapper">
                  <div class="table-header-left">
                    <b>Demand</b><br>
                    Last 12 Months
                  </div>
                  <div class="table-header-right">
                    <a-icon type="up-circle"></a-icon>
                  </div>
                </div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Roche Demand Change</td>
              <td>
                3%
              </td>
            </tr>
            <tr>
              <td>Market Demand Change</td>
              <td>12%</td>
            </tr>
            <tr>
              <td>Market Demand Volatility</td>
              <td>
                Low
              </td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <!-- / Demand -->
        <!-- Risk -->
        <a-col :span="6">
          <table class="axpi-basic-table">
            <thead>
            <tr>
              <th colspan="2">
                <div class="table-header-wrapper">
                  <div class="table-header-left">
                    <b>Risk</b><br>
                    Current Data
                  </div>
                  <div class="table-header-right">
                    <a-icon type="alert"></a-icon>
                  </div>
                </div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Risk Level</td>
              <td>
                High
              </td>
            </tr>
            <tr>
              <td>Suppliers at Risk</td>
              <td>10</td>
            </tr>
            </tbody>
          </table>
        </a-col>
        <!-- / Risk -->
      </a-row>
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import axios from 'axios';
import Orders from "../../mixins/Orders";

export default {
  name: "DashboardStats",
  mixins: [Orders],
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
  border: 1px solid #ECECEC;
}

.loader-description {
  margin-left: 10px;
}

.stats-wrapper {
  /*border: 1px solid #ECECEC;*/
}

.axpi-basic-table thead tr {
  border-bottom: 2px solid #e8e8e8;
  color: rgba(0, 0, 0, 0.85);
}

.axpi-basic-table tbody tr {
  border-bottom: none;
}

.axpi-basic-table tr td:last-child {
  text-align: right;
}

.table-header-wrapper {
  display: flex;
  flex-direction: row;
}

.table-header-left {
  flex-grow: 1;
  font-weight: normal;
}

.table-header-right {
  flex-shrink: 1;
  font-size: 30px;
  display: flex;
  align-items: center;
}
</style>