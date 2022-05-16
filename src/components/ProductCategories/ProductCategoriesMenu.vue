<template>
  <div class="product-menu-wrapper">
    <a-dropdown :visible="visible" @visibleChange="visibleChange" trigger="click">
      <a-button size="medium" class="product-menu-btn" type="default" icon="menu" @click.prevent> </a-button>
      <template #overlay>
        <a-menu class="menu">
          <template v-for="(item, index) in categories">
            <a-menu-item v-if="!item.children" class="dropdown-item" :key="index">
              {{ item.name }}
            </a-menu-item>
            <sub-menu v-else :key="index" :menu-info="item" />
          </template>
        </a-menu>
      </template>
    </a-dropdown>
    <div
      class="menu-bg"
      :style="
        visible
          ? 'visibility: visible;opacity: 1'
          : 'visibility: hidden;opacity: 0;transition: visibility 0.5s,opacity 1s linear'
      "
    ></div>
  </div>
</template>

<script>
import client from "@/api/client";
import subMenu from "./SubMenu";

export default {
  name: "ProductCategoriesMenu",
  components: { subMenu },
  data() {
    return {
      categories: [],
      visible: false,
    };
  },
  async created() {
    try {
      const store = (await client.get(`/stores`)).data;
      if (store.length > 0) {
        const categoriesData = (await client.get(`/stores/${store[0].id}}}/categories`)).data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        this.categories = this.getCategories(categoriesData);
      }
    } catch (e) {
      console.log("err", e);
    }
  },
  methods: {
    visibleChange(visible) {
      this.visible = visible;
    },
    getCategories(data, parent_id = null) {
      let treedata = [];
      for (let item of data) {
        if (item.parent_id === parent_id) {
          let node = {
            id: item.id,
            name: item.name,
          };
          const children = this.getCategories(data, node.id);
          if (children.length > 0) node.children = children;
          treedata.push(node);
        }
      }
      return treedata;
    },
  },
};
</script>

<style scoped lang="scss">
.product-menu-btn {
  border-radius: 31px;
  width: 50px;
}

.product-menu-wrapper {
  padding-left: 35px;
}

.dropdown-item {
  font-size: 16px;
  min-width: 200px;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.menu-bg {
  width: 100vw;
  height: calc(90vh - 100px);
  background: white;
  border-bottom: 1px solid #cccccc;
  position: fixed;
  top: 57px;
  left: 0;
  z-index: 2;
}

.menu {
  box-shadow: none;
  margin-top: 12px;
}
</style>
