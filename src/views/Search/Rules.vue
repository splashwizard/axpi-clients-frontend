<template>
  <a-layout>
    <left-sidebar></left-sidebar>
    <a-layout style="padding: 7px 30px">
      <h1 class="page-title">Rules</h1>
      <a-card :bodyStyle="{padding: 0}">
        <rules-header :searchTerm="searchTerm" :changeSearchTerm="changeSearchTerm" :rulesCount="rules.length"/>
        <rules-table :searchTerm="searchTerm" :rules="rules" :editRule="editRule" :disableRule="disableRule" :deleteRule="deleteRule" />
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
      searchTerm: '',
    }
  },
  methods: {
    changeSearchTerm(value) {
      this.searchTerm = value;
    },
    editRule(key) {
      this.$router.push(`/search/rules/visual-editor/edit/${key}`);
    },
    disableRule(key, checked) {
      this.rules[this.rules.findIndex(item => item.key === key)].disabled = checked;
    },
    deleteRule(key) {
      this.rules = this.rules.filter(item => item.key !== key);
      localStorage.setItem('rules', JSON.stringify(this.rules));
    },
  },
  created() {
    const ruleData = localStorage.getItem('rules') ? JSON.parse(localStorage.getItem('rules')) : [];
    this.rules = ruleData.map((rule) => ({
      ...rule,
      disabled: false,
      visibleActions: false
    }));
  }
}
</script>

<style scoped>

</style>