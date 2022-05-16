<template>
  <div class="shop-basket">
    <a-layout style="padding: 7px 30px">
      <div>
        <a-page-header :title="listName" @back="goBackToLists"> </a-page-header>
      </div>
      <list-view-table :data="products" />
    </a-layout>
  </div>
</template>

<script>
// const list_products = [
//   {id: 'product-1', image: 'https://i.ibb.co/nCj4mJc/Screenshot-2022-01-13-at-11-17-27.png', name: 'Product A', cost: '12$', product_identifiers: 'xxx-yy', supplier: 'xyzabc', listId: 'list-1'},
//   {id: 'product-2', image: 'https://i.ibb.co/nCj4mJc/Screenshot-2022-01-13-at-11-17-27.png', name: 'Product B', cost: '12$', product_identifiers: 'xxx-yy', supplier: 'xyzabc', listId: 'list-1'},
//   {id: 'product-3', image: 'https://i.ibb.co/nCj4mJc/Screenshot-2022-01-13-at-11-17-27.png', name: 'Product C', cost: '12$', product_identifiers: 'xxx-yy', supplier: 'xyzabc', listId: 'list-2'}
// ];
import ListViewTable from "./Lists/ViewTable";
// import {mapGetters, mapActions} from 'vuex';
import { mapGetters } from "vuex";
export default {
  name: "ViewList",
  components: { ListViewTable },
  data() {
    return {
      products: [],
      searchTerm: "",
      listName: "",
    };
  },
  created() {
    const listId = this.$route.params.id;
    const list = this.list.find((item) => item.id === listId);
    this.listName = list.name;
    this.products = list.items;
  },
  computed: {
    ...mapGetters("shop", {
      list: "list",
    }),
  },
  methods: {
    goBackToLists() {
      this.$router.push("/shop/lists");
    },
    editList() {},
    deleteList() {},
  },
};
</script>

<style scoped lang="scss"></style>
