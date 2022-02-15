<template>
  <a-layout>
    <left-sidebar></left-sidebar>
    <a-layout style="padding: 7px 30px">
      <h1 class="page-title">Rules</h1>
      <a-card bodyStyle="padding: 0">
        <rules-header :searchTerm="searchTerm" :changeSearchTerm="changeSearchTerm" :rulesCount="rules.length"/>
        <rules-table :searchTerm="searchTerm" :rules="rules"/>
      </a-card>
    </a-layout>
  </a-layout>
</template>

<script>
import RulesHeader from "./Rules/Header";
import RulesTable from "./Rules/Table";
import LeftSidebar from "./LeftSidebar";

export default {
  name: "Landing",
  components: {RulesHeader, RulesTable,  LeftSidebar},
  data() {
    return {
      rules: [],
      searchTerm: 'iP',
    }
  },
  methods: {
    changeSearchTerm(value) {
      this.searchTerm = value;
    }
  },
  created() {
    const ruleData = localStorage.getItem('rules') ? JSON.parse(localStorage.getItem('rules')) : [];
    this.rules = ruleData.map((rule, ruleIdx) => ({
      ...rule,
      index: ruleIdx,
      disabled: false,
      visibleActions: false
    }));
  }
}
</script>

<style scoped>

</style>