<template>
  <div class="shop-index">
    <loading-screen :is-loading="isLoading"></loading-screen>

    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <a-page-header title="Shop">
            <template slot="extra">
              <a-button icon="shopping" @click="goToBasket">
                <span style="margin-right: 5px;">Basket</span> <span v-if="basket.length">({{ basket.length }})</span>
              </a-button>
            </template>
          </a-page-header>

          <!-- Search -->
          <div class="search-wrapper">
            <div class="left">
              <a-input-search
                  placeholder="Search by catalog number, product name, keyword, application"
                  enter-button="Search"
                  v-model="search_query"
                  size="large"
                  @search="search"
              />
            </div>
            <div class="right">
              <add-spec-to-basket-button-and-modal></add-spec-to-basket-button-and-modal>
            </div>
          </div>

          <!-- / Search -->

          <div class="table-wrapper" v-if="tableData && tableData.length">
            <a-table v-if="!isLoading" class="axpi-table column-dividers"
                     :scroll="{ x: 'max-content' }"
                     :columns="columns"
                     :data-source="tableData"
                     :pagination="pagination"
                     @change="handleTableChange"
                     :loading="isLoading"
            >
              <div slot="image" slot-scope="image, row">
                <a-avatar
                    size="large"
                    :src="getImageSrc(row)"
                />
              </div>

              <div slot="datasheet" slot-scope="datasheet, row">
                <span>
                  <a :href="row.URL" target="_blank">
                    <a-icon type="link"></a-icon>
                    Datasheet
                  </a>
                </span>
              </div>

              <div v-for="(p,i) in uniqueProperties" :slot="p" :key="i" slot-scope="property">
                <span v-html="property"></span>
              </div>

              <div slot="actions" slot-scope="actions, record">
                <a-button v-if="!isProductInBasket(record)"
                          type="primary" @click.prevent="() => addProductToBasket(record)">Add to basket
                </a-button>

                <div v-else class="quantity-changer">
                  <a-button @click.prevent="() => decrementProductQuantity(record)"
                            icon="minus">
                  </a-button>
                  <div>{{ getQuantityOfProductInBasket(record) }}</div>
                  <a-button @click.prevent="() => incrementProductQuantity(record)"
                            icon="plus"></a-button>
                </div>
              </div>
            </a-table>
          </div>

        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import Units from "../mixins/Units";
import AddSpecToBasketButtonAndModal from "./Shop/AddSpecToBasketButtonAndModal";

const _ = require('lodash');

export default {
  name: "Shop",
  components: {AddSpecToBasketButtonAndModal},
  mixins: [Units],
  computed: {
    ...mapGetters('shop', {
      searchResults: 'searchResults',
      isLoading: 'isLoading',
      searchQuery: 'searchQuery',
      tablePagination: 'tablePagination',
      basket: 'basket',
      enriched: 'enriched'
    }),

    search_query: {
      get() {
        return this.searchQuery;
      },
      set(val) {
        this.setSearchQuery(val);
      }
    },

    pagination: {
      get() {
        return this.tablePagination;
      },
      set(val) {
        this.setTablePagination(val);
      }
    },

    uniqueProperties() {
      let properties = [];
      _.each(Object.values(this.enriched), ps => {
        properties.push(_.map(ps, 'propertyName'));
        properties = _.flatten(properties);
      });
      return _.uniq(properties);
    },

    columns() {
      return [
        {
          title: '',
          width: 60,
          fixed: 'left',
          scopedSlots: {customRender: 'image'}
        },
        {
          title: 'Name',
          dataIndex: 'name',
          width: 350,
          fixed: 'left'
        },
        {
          title: 'Market Data',
          children: [
            {
              title: '',
              dataIndex: 'datasheet',
              scopedSlots: {customRender: 'datasheet'}
            },
            {
              title: 'Price',
              dataIndex: 'price',
              scopedSlots: {customRender: 'price'}
            }
          ]
        },
        {
          title: 'Most Relevant',
          children: [
            ..._.map(this.uniqueProperties, (p) => ({
              title: p,
              dataIndex: p,
              sorter: false,
              width: 200,
              scopedSlots: {customRender: p}
            })),
          ]
        },
        {
          title: '',
        },
        {
          title: "",
          scopedSlots: {customRender: "actions"},
          width: 10,
          fixed: 'right'
        },
      ]
    },

    tableData() {
      // return this.searchResults.data;
      return _.map(this.searchResults.data, product => {
        _.each(this.uniqueProperties, p => {
          let property = _.find(product.all_properties, {
            propertyName: p
          });
          if (property) {
            if (property.variableType && property.variableType === 'categorical') {
              product[p] = property.propertyValue;
            } else {
              let magnitudeFormatted = property.propertyValue;
              if (magnitudeFormatted < 1 && magnitudeFormatted !== 0) {
                let exp = Number.parseFloat(magnitudeFormatted).toExponential(3);
                let split = exp.split('e');
                magnitudeFormatted = split[0] + ' x 10' + '<sup>' + split[1] + '</sup>'
              }

              let propertyUnitFormatted = this.formatUnit(property.propertyUnit);
              product[p] = magnitudeFormatted + ' ' + propertyUnitFormatted;
            }
          } else {
            product[p] = '';
          }
        });
        return product;
      });
    }
  },
  created() {
    // this.search();
  },
  methods: {
    ...mapActions('shop', {
      search: 'search',
      setSearchQuery: 'setSearchQuery',
      setTablePagination: 'setTablePagination',
      addProductToBasket: 'addProductToBasket',
      incrementProductQuantity: 'incrementProductQuantity',
      decrementProductQuantity: 'decrementProductQuantity'
    }),

    getImageSrc(order) {
      if (order['imageURLs'] && order['imageURLs'].length) {
        return order['imageURLs'][0];
      }
    },

    goToBasket() {
      this.$router.push('/shop/basket');
    },

    handleTableChange(pagination, filters, sorter) {
      const pager = {...this.pagination};
      pager.current = pagination.current;
      // this.setPagination(pager);
      this.pagination = pager;
      this.search({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sort_field: sorter.field,
        sort_order: sorter.order,
        ...filters,
      });
    },

    isProductInBasket(product) {
      return _.filter(this.basket, item => {
        return (
            item.itemType === 'product'
            && item.id === product['_id']
        );
      }).length > 0;
    },

    getQuantityOfProductInBasket(product) {
      return _.find(this.basket, item => {
        return (
            item.itemType === 'product'
            && item.id === product['_id']
        );
      }).quantity;
    }
  }
}
</script>

<style scoped lang="scss">
.shop-index {

}

.table-wrapper {
  margin-top: 25px;
}

.wrapper {
  max-height: 100%;
  overflow-y: scroll;
}

.quantity-changer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-wrapper {
  display: flex;
  align-items: center;

  .left {
    flex: 1;
  }

  .right {
    flex-shrink: 1;
    padding-left: 10px;
  }
}
</style>