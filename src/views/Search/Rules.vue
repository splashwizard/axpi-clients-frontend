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
import axios from 'axios';

export default {
  name: "Landing",
  components: {RulesHeader, RulesTable, LeftSidebar},
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
    // const ruleData = localStorage.getItem('rules') ? JSON.parse(localStorage.getItem('rules')) : [];
    // this.rules = ruleData.map((rule) => ({
    //   ...rule,
    //   disabled: false,
    //   visibleActions: false
    // }));
    axios.get(`${window.API_BASE}/rules`).then((res) => {
      const { overrides } = res.data;
      this.rules = overrides.map(override => {
        const { id, rule, includes } = override;
        let query_conditions = [
          {
            query: {
              option: rule.match,
              keyword: rule.query
            }
          }
        ];
        let pinnedItems = includes.map(include => ({
          id: include.id,
          position: include.position,
          title: "CGE Syringes, General Purpose Manual Syringe, PTFE Tipped Plunger, Trajan Scientific and Medical"
        }));
        return {
          conditions: {
            query_conditions: query_conditions,
            period: []
          },
          consequences: {
            filterResults: [],
            boostCategories: [],
            buryCategories: [],
            pinnedItems: pinnedItems,
            hiddenItems: []
          },
          key: id,
          timestamp: '2022-02-24T15:28:32.318Z'
        };
      })
    }).catch(() => {
      this.$message.error('Error fetching rules');
    });
  }
}
</script>

<style scoped>

</style>