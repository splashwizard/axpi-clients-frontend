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
          <a-menu-item class="dropdown-item">1st menu item</a-menu-item>
          <a-menu-item class="dropdown-item">2nd menu item</a-menu-item>
          <a-sub-menu class="sub-item" title="sub menu">
            <a-menu-item class="dropdown-item">3rd menu item</a-menu-item>
            <a-menu-item class="dropdown-item">4th menu item</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>

export default {
  name: "ProductCategoriesMenu",
  data() {
    return {
      categories: {
        name: 'Home',
        url: 'http://xxxxxxxxx.com',
        children: [
          {
            name: 'Appliances',
            url: 'http://xxxxxxxxx.com',
            children: [
              {
                name: 'Television',
                url: 'http://xxxxxxxxx.com',
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
    }
  },
  created() {
  },
  methods: {
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
    width: 250px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>