<template>
  <div>
    <a-input-search
      placeholder="Search products by name, product code or catalog code"
      v-model="searchQuery"
      style="width: 100%; margin-bottom: 10px"
      @search="search"
    />

    <!-- Loading -->
    <div class="loading-screen" v-if="isLoading || searchQueryIsDirty">
      <a-spin />
    </div>
    <!-- / Loading -->

    <!-- Loaded -->
    <div v-if="!(isLoading || searchQueryIsDirty)">
      <!-- No matches -->
      <a-alert type="error" message="No products found" v-if="dataToShow.length === 0 && searchQuery.length" banner />
      <!-- / No matches -->

      <!-- Matches -->
      <div class="wrapper" v-if="dataToShow.length || matchesSelectedManually.length">
        <matches :matches="dataToShow" :ids-of-manual-selections="matchesSelectedManually"></matches>
      </div>
      <!-- / Matches -->
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../../mixins/Orders";
import Matches from "./Matches";
import { mapGetters } from "vuex";

const _ = require("lodash");

export default {
  name: "SearchOrders",
  mixins: [Orders],
  data() {
    return {
      isLoading: false,
      searchQueryIsDirty: false,
      searchQuery: "",
      data: [],
    };
  },
  components: { Matches },
  watch: {
    searchQuery() {
      this.searchQueryIsDirty = true;
      this.search();
    },
  },
  computed: {
    ...mapGetters("matcher", {
      matchesSelectedManually: "matchesSelectedManually",
    }),

    dataToShow() {
      return _.filter(this.data, (d) => {
        return !_.includes(this.matchesSelectedManually, Object.values(d["_id"])[0]);
      });
    },
  },
  methods: {
    determineSearchParams(params) {
      let search = {
        q: this.searchQuery,
      };

      return {
        ...search,
        ...params,
      };
    },

    search: _.debounce(function (params) {
      if (this.searchQuery.trim() == "") {
        this.isLoading = false;
        this.searchQueryIsDirty = false;
        this.data = [];
        return false;
      }

      this.isLoading = true;
      axios
        .post(window.API_BASE + "/matcher/search-products", this.determineSearchParams(params))
        .then((r) => {
          // const pagination = {...this.pagination};
          this.isLoading = false;
          this.data = r.data;
          this.searchQueryIsDirty = false;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading products");
        });
    }, 500),
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
