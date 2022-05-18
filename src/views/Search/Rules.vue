<template>
  <a-layout>
    <left-sidebar></left-sidebar>
    <a-layout style="padding: 7px 30px">
      <h1 class="page-title">Rules</h1>
      <a-card v-if="loading" class="loading-card">
        <a-spin size="large" />
      </a-card>
      <a-card v-else :bodyStyle="{ padding: 0 }">
        <rules-header :searchTerm="searchTerm" :changeSearchTerm="changeSearchTerm" :rulesCount="list.length" />
        <rules-table
          :searchTerm="searchTerm"
          :rules="list"
          :editRule="editRule"
          :disableRule="disableRule"
          :deleteRule="deleteRule"
        />
      </a-card>
    </a-layout>
  </a-layout>
</template>

<script>
import RulesHeader from "./Rules/Header";
import RulesTable from "./Rules/Table";
import LeftSidebar from "./LeftSidebar";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Landing",
  components: { RulesHeader, RulesTable, LeftSidebar },
  data() {
    return {
      searchTerm: "",
    };
  },
  computed: {
    ...mapGetters("rule", {
      list: "list",
      loading: "loading",
      isLoaded: "isLoaded",
    }),
  },
  methods: {
    ...mapActions("rule", {
      load: "load",
      disable: "disableRule",
      delete: "deleteRule",
    }),
    changeSearchTerm(value) {
      this.searchTerm = value;
    },
    editRule(key) {
      this.$router.push(`/search/rules/visual-editor/edit/${key}`);
    },
    disableRule(key, checked) {
      const { conditions, consequences } = this.list.find((item) => item.key === key);
      const { query_conditions, period } = conditions;
      let payload = {
        query_name: query_conditions[0].query.keyword,
        query_type: query_conditions[0].query.option,
        is_enable: !checked,
      };

      if (period.length > 0) {
        payload["start_date"] = period[0].format("YYYY-MM-DD");
        payload["end_date"] = period[1].format("YYYY-MM-DD");
      }

      const { pinnedItems, hiddenItems, filterResults } = consequences;
      if (pinnedItems.length > 0) {
        payload["pin_items"] = pinnedItems.map((item) => ({
          id: item.id,
          position: item.position,
        }));
      }
      if (hiddenItems.length > 0) {
        payload["hidden_items"] = hiddenItems.map((item) => ({
          id: item.id,
          position: item.position,
        }));
      }

      if (filterResults.length > 0) {
        payload["filter_by"] = {};
        filterResults.forEach((item) => {
          payload["filter_by"][item[0].name] = item[0].keyword;
        });
      }
      this.disable({ key, checked });
      axios
        .put(`${window.API_BASE}/rules/${key}`, payload)
        .then(() => {})
        .catch((e) => {
          if (process.env.NODE_ENV !== "production") {
            console.log(e);
          }
        });
    },
    deleteRule(key) {
      axios
        .delete(`${window.API_BASE}/rules/${key}`)
        .then(() => {
          this.delete(key);
          this.loading = false;
          this.$message.success("Rule deleted successfully");
        })
        .catch(() => {
          this.$message.error("Error deleting rule");
        });
    },
  },
  created() {
    if (!this.isLoaded) this.load();
  },
};
</script>

<style scoped>
.loading-card {
  background-color: #fafafa;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
