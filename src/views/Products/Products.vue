<template>
  <a-layout>
    <left-sidebar></left-sidebar>
    <a-layout style="padding: 7px 30px">
      <products-header :searchTerm="searchTerm" :changeSearchTerm="changeSearchTerm" :rulesCount="rules.length" />
      <products-table
        :searchTerm="searchTerm"
        :data="products"
        :editRule="editRule"
        :disableRule="disableRule"
        :deleteRule="deleteRule"
      />
    </a-layout>
  </a-layout>
</template>

<script>
import { mapGetters } from "vuex";
import ProductsHeader from "./Products/Header";
import ProductsTable from "./Products/Table";
import LeftSidebar from "./LeftSidebar";

export default {
  name: "Landing",
  components: { ProductsHeader, ProductsTable, LeftSidebar },
  data() {
    return {
      products: [],
      searchTerm: "",
    };
  },
  methods: {
    changeSearchTerm(value) {
      this.searchTerm = value;
    },
    editRule(key) {
      this.$router.push(`/search/rules/visual-editor/edit/${key}`);
    },
    disableRule(key, checked) {
      this.rules[this.rules.findIndex((item) => item.key === key)].disabled = checked;
    },
    deleteRule(key) {
      this.rules = this.rules.filter((item) => item.key !== key);
      localStorage.setItem("rules", JSON.stringify(this.rules));
    },
  },
  created() {
    const ruleData = localStorage.getItem("rules") ? JSON.parse(localStorage.getItem("rules")) : [];
    this.rules = ruleData.map((rule) => ({
      ...rule,
      disabled: false,
      visibleActions: false,
    }));
    this.products = this.list[1].items;
    console.log("products", this.products);
  },
  computed: {
    ...mapGetters("shop", {
      list: "list",
    }),
  },
};
</script>

<style scoped></style>
