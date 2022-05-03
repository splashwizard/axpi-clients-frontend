<template>
  <div class="product-menu-wrapper">
    <a-dropdown>
      <a-button size="medium" class="product-menu-btn" type="default" icon="menu" @click.prevent>
      </a-button>
      <!-- <a class="ant-dropdown-link" @click.prevent>
        Cascading menu
        <DownOutlined />
      </a> -->
      <template #overlay>
        <a-menu>
          <template v-for="(item, index) in categories">
            <a-menu-item v-if="!item.children" class="dropdown-item" :key="index">
              {{item.name}}
            </a-menu-item>
            <sub-menu v-else :key="index" :menu-info="item"/>
          </template>
        </a-menu>

        <!-- <a-menu-item class="dropdown-item">1st menu item</a-menu-item>
        <a-menu-item class="dropdown-item">2nd menu item</a-menu-item>
        <a-sub-menu class="sub-item" title="sub menu">
          <a-menu-item class="dropdown-item">3rd menu item</a-menu-item>
          <a-sub-menu class="sub-item" title="sub menu">
            <a-menu-item class="dropdown-item">3rd menu item</a-menu-item>
            <a-menu-item class="dropdown-item">4th menu item</a-menu-item>
          </a-sub-menu>
        </a-sub-menu> -->
      </template>
    </a-dropdown>
  </div>
</template>

<script>

import client from '@/api/client'
import subMenu from './SubMenu';

export default {
  name: "ProductCategoriesMenu",
  components: { subMenu },
  data() {
    return {
      menuInfo: [
        {
            key: '1',
            title: 'Home',
            icon: 'home',
            children: [{
                key: '1.1',
                title: 'Bell',
                icon: 'bell'
            }]
        },
        {
            title: 'Bedroom',
            children: [{
                title: 'bulb',
            }]
        },
        {
          title: 'Livingroom',
        }
    ],
      categories: [
        {
          name: 'Appliances',
          url: 'http://xxxxxxxxx.com',
          children: [
            {
              name: 'Television',
              url: 'http://xxxxxxxxx.com',
              children: [
                {
                  name: 'Apple',
                  url: 'http://xxxxxxxxx.com',
                },
                {
                  name: 'Microsoft',
                  url: 'http://xxxxxxxxx.com',
                },
              ],
            },
            {
              name: 'Microwaves',
              url: 'http://xxxxxxxxx.com',
            },
          ],
        },
        {
          name: 'Furniture',
          url: 'http://xxxxxxxxx.com',
          children: [
            {
              name: 'Couch',
              url: 'http://xxxxxxxxx.com',
            },
            {
              name: 'Bed',
              url: 'http://xxxxxxxxx.com',
              children: [
                {
                  name: 'King Size',
                  url: 'http://xxxxxxxxx.com'
                },
                {
                  name: 'Queen Size',
                  url: 'http://xxxxxxxxx.com',
                },
              ],
            },
          ],
        },
      ]
    }
  },
  created() {
    const storeID = 2;
    client.get(`/stores/${storeID}/categories`).then((res) => {
      console.log('res', res);
      this.categories = this.getCategories(res.data);
    }).catch(() => {
      this.$message.error('Error deleting rule');
    });
  },
  methods: {
    getCategories(data, parent_id = null) {
      let treedata = [];
      for(let item of data) {
        if(item.parent_id === parent_id){
          let node = {
            id: item.id,
            name: item.name
          };
          const children = this.getCategories(data, node.id);
          if(children.length > 0)
            node.children = children;
          treedata.push(node);
        }
      }
      return treedata;
    },
    showMethodSelectorModal() {

    }
  }
}
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
</style>