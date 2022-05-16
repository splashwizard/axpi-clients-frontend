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
                      <b>Data Overview</b><br />
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
                  {{ stats["number_of_suppliers"] }}
                </td>
              </tr>
              <tr>
                <td>Business Units</td>
                <td>
                  {{ stats["number_of_organisational_units"] }}
                </td>
              </tr>
              <tr>
                <td>Categories</td>
                <td>
                  {{ stats["number_of_categories"] }}
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
                      <b>Spend</b><br />
                      {{ dateRange }}
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
                <td>Spend Managed</td>
                <td>
                  {{
                    stats["spend_managed"] ? formatCost({ cost: stats["spend_managed"], cost_currency: "USD" }) : "-"
                  }}
                </td>
              </tr>
              <tr>
                <td>Orders Classified</td>
                <td>{{ stats["orders_classified_percentage"] ? stats["orders_classified_percentage"] : "-" }}</td>
              </tr>
              <tr>
                <td>Total Spend</td>
                <td>
                  {{ stats["total_spend"] ? formatCost({ cost: stats["total_spend"], cost_currency: "USD" }) : "-" }}
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
                      <b>Demand</b><br />
                      {{ dateRange }}
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
                <!--              <td>{{ user.client.name }} Demand Change</td>-->
                <td>Roche Demand Change</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Market Demand Change</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Market Demand Volatility</td>
                <td>-</td>
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
                      <b>Risk</b><br />
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
                <td>-</td>
              </tr>
              <tr>
                <td>Suppliers at Risk</td>
                <td>-</td>
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
import axios from "axios";
import Orders from "../../mixins/Orders";
import { mapGetters } from "vuex";

const _ = require("lodash");

export default {
  name: "DashboardStats",
  props: ["filters"],
  mixins: [Orders],
  data() {
    return {
      isLoading: false,
      stats: [],
    };
  },
  computed: {
    ...mapGetters("auth", {
      user: "user",
    }),

    dateRange() {
      if (this.filters["filters_enabled"].length && this.filters["filters_enabled"].includes("date_range")) {
        if (this.filters["date_range"] == "last-5-years") {
          return "Last 5 Years";
        } else if (this.filters["date_range"] == "last-12-months") {
          return "Last 12 Months";
        } else if (this.filters["date_range"] == "last-month") {
          return "Last Month";
        }
      }
      return "Last 12 Months";
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/intelligence/stats", this.getSearchParams())
        .then((r) => {
          vm.isLoading = false;
          vm.stats = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.stats = null;
          vm.$message.error("Error loading stats");
        });
    },

    getSearchParams() {
      let filters = {};

      _.each(this.filters["filters_enabled"], (key) => {
        filters[key] = this.filters[key];
      });

      if (!Object.keys(filters).includes("date_range")) {
        filters["date_range"] = "last-12-months";
      }

      return filters;
    },
  },
};
</script>

<style scoped>
.loader {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid #ececec;
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
