<template>
  <div class="shop-index">
    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <a-page-header title="Shop">
            <template slot="extra">
              <a-radio-group v-model="display_mode">
                <a-radio-button value="prices">
                  <span style="margin-right: 3px;">$</span>
                  Prices
                </a-radio-button>
                <a-radio-button value="specs">
                  <a-icon style="margin-right: 5px" type="form"></a-icon>
                  Specs
                </a-radio-button>
              </a-radio-group>

              <a-button icon="shopping" @click="goToBasket">
                <span style="margin-right: 5px;">Basket</span> <span v-if="basket.length">({{ basket.length }})</span>
              </a-button>
            </template>
          </a-page-header>

          <!--          &lt;!&ndash; Search &ndash;&gt;-->
          <!--          <div class="search-wrapper">-->
          <!--            <div class="left">-->
          <!--              <a-input-search-->
          <!--                  placeholder="Search by catalog number, product name, keyword, application"-->
          <!--                  enter-button="Search"-->
          <!--                  v-model="search_query"-->
          <!--                  size="large"-->
          <!--                  @search="search"-->
          <!--              >-->
          <!--                <a-select slot="addonBefore" default-value="Search all" style="width: 120px">-->
          <!--                  <a-select-option value="all">-->
          <!--                    Search all-->
          <!--                  </a-select-option>-->
          <!--                </a-select>-->
          <!--              </a-input-search>-->
          <!--            </div>-->
          <!--            <div class="right">-->
          <!--              <add-spec-to-basket-button-and-modal></add-spec-to-basket-button-and-modal>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--          &lt;!&ndash; / Search &ndash;&gt;-->

          <!-- Instant search -->
          <ais-instant-search :search-client="searchClient" index-name="products">
            <ais-configure :hits-per-page.camel="8"/>

            <a-row :gutter="30">
              <a-col span="5" style="padding-left: 17px;">
                <ais-panel>
                  <ais-clear-refinements></ais-clear-refinements>
                </ais-panel>
                <ais-panel>
                  <h4>Manufacturer</h4>
                  <ais-refinement-list attribute="manufacturer"/>
                </ais-panel>
              </a-col>
              <a-col :span="19" style="padding-right: 17px;">
                <ais-panel>
                  <ais-search-box placeholder=""/>
                </ais-panel>

                <ais-panel>
                  <!-- Prices display mode -->
                  <ais-hits v-if="displayMode == 'prices'">
                    <template slot="item" slot-scope="{ item }">
                      <article class="shop-item-result">
                        <a-row :gutter="20">
                          <a-col :span="6">
                            <div class="product-image-wrapper">
                              <img
                                  :src="getImageSrc(item)"
                                  :alt="item['name']"
                                  class="product-image"
                              />
                            </div>
                          </a-col>
                          <a-col :span="18">
                            <h1 class="item-title">
                              <ais-highlight
                                  :hit="item"
                                  attribute="name"
                                  class="hit-name"
                              />
                            </h1>

                            <div class="description-wrapper">
                              {{ item.description }}
                            </div>

                            <div class="price-list-actions-wrapper">
                              <div class="left">
                                <a-input v-if="!isProductInBasket(item)" class="quantity-input" placeholder="1"
                                         v-model="quantities[item.id]" type="number"></a-input>
                                <a-button v-if="!isProductInBasket(item)"
                                          type="primary" @click.prevent="() => addToBasket(item)">Add to basket
                                </a-button>

                                <div v-else class="quantity-changer">
                                  <a-button @click.prevent="() => decrementProductQuantity(item)"
                                            icon="minus">
                                  </a-button>
                                  <div>
                                    <a-input type="number"
                                             @change="e => setProductQuantity({quantity: e.target.value, id: item['id']})"
                                             :value="getQuantityOfProductInBasket(item)"></a-input>
                                  </div>
                                  <!--                        <div>{{ getQuantityOfProductInBasket(item) }}</div>-->
                                  <a-button @click.prevent="() => incrementProductQuantity(item)"
                                            icon="plus"></a-button>
                                </div>
                              </div>
                            </div>
                          </a-col>
                        </a-row>
                      </article>
                    </template>
                  </ais-hits>
                  <!-- / Prices display mode -->

                  <!-- Specs display mode -->
                  <specs-display :quantities="quantities" v-if="displayMode == 'specs'"></specs-display>
                  <!-- / Specs display mode -->
                </ais-panel>

                <ais-panel>
                  <ais-pagination/>
                </ais-panel>
              </a-col>
            </a-row>
          </ais-instant-search>
          <!-- / Instant search -->

        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import Units from "../mixins/Units";
// import axios from 'axios';
// import AddSpecToBasketButtonAndModal from "./Shop/AddSpecToBasketButtonAndModal";
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import SpecsDisplay from "./Shop/SpecsDisplay";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'axiom', // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
        host: 'localhost',
        port: '8108',
        protocol: 'http',
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  //  filterBy is managed and overridden by InstantSearch.js. To set it, you want to use one of the filter widgets like refinementList or use the `configure` widget.
  additionalSearchParameters: {
    queryBy: 'name',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const _ = require('lodash');

export default {
  name: "Shop",
  components: {
    SpecsDisplay
    // AddSpecToBasketButtonAndModal
  },
  mixins: [
    Units
  ],
  data() {
    return {
      quantities: {},
      searchClient
    }
  },
  computed: {
    ...mapGetters('shop', {
      displayMode: 'displayMode',
      basket: 'basket'
    }),

    uniqueProperties() {
      return [];
    },

    display_mode: {
      get() {
        return this.displayMode;
      },
      set(val) {
        this.setDisplayMode(val);
      }
    }
  },
  created() {
    // this.search();
  },
  methods: {
    ...mapActions('shop', {
      addProductToBasket: 'addProductToBasket',
      incrementProductQuantity: 'incrementProductQuantity',
      decrementProductQuantity: 'decrementProductQuantity',
      setProductQuantity: 'setProductQuantity',
      setDisplayMode: 'setDisplayMode'
    }),

    addToBasket(record) {
      let quantity = this.quantities[record['id']];
      if (!quantity) {
        quantity = 1;
      }
      this.addProductToBasket({
        quantity: quantity,
        product: record
      });
    },

    getProductPageUrl(product) {
      return '/products/' + product['id'] + '?fromShop=1';
    },

    getImageSrc(order) {
      if (order['imageURLs'] && order['imageURLs'].length) {
        return order['imageURLs'][0];
      }
    },

    goToBasket() {
      this.$router.push('/shop/basket');
    },

    isProductInBasket(product) {
      return _.filter(this.basket, item => {
        return (
            item.itemType === 'product'
            && item.id === product['id']
        );
      }).length > 0;
    },

    getQuantityOfProductInBasket(product) {
      return _.find(this.basket, item => {
        return (
            item.itemType === 'product'
            && item.id === product['id']
        );
      }).quantity;
    }
  }
}
</script>

<style lang="scss">
.shop-index {
  .shop-index {

  }

  .table-wrapper {
    margin-top: 25px;
    padding-bottom: 20px;

    .add-to-basket-button {
      width: 100%;
    }
  }

  .prices-list-wrapper {
    margin-top: 20px;
    padding-bottom: 20px;

    .ant-list-item-meta {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .ant-avatar {
      width: 140px;
      height: 140px;
      line-height: 60px;
      margin-right: 15px;
    }

    .ant-list-item-meta-title {
      font-size: 17px;
      margin-bottom: 6px;

      //a {
      //  color: #000;
      //}
    }


  }

  .price-list-actions-wrapper {
    //margin-bottom: 10px;

    margin-top: 25px;

    display: flex;

    //.left {
    //  flex-grow: 1;
    //}

    .left {
      max-width: 350px;
      //flex-shrink: 1;
      flex-grow: 1;
      display: flex;

      .quantity-input {
        margin-right: 10px;
      }
    }

    .ant-input {
      width: 110px;
    }
  }

  .wrapper {
    max-height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .quantity-changer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 190px;

    .ant-input {
      width: 110px;
    }
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

  .title-wrapper {
    display: flex;

    .left {
      flex-grow: 1;
    }

    .right {
      flex-shrink: 1;
    }
  }

  .price {
    font-size: 15px;
  }

  .table-add-to-basket-wrapper {
    display: flex;

    .ant-input {
      margin-right: 10px;
    }
  }

  //em {
  //  background: cyan;
  //  font-style: normal;
  //}
  //.header {
  //  display: flex;
  //  align-items: center;
  //  min-height: 50px;
  //  padding: 0.5rem 1rem;
  //  background-image: linear-gradient(to right, #4dba87, #2f9088);
  //  color: #fff;
  //  margin-bottom: 1rem;
  //}
  //.header a {
  //  color: #fff;
  //  text-decoration: none;
  //}
  //.header-title {
  //  font-size: 1.2rem;
  //  font-weight: normal;
  //}
  //.header-title::after {
  //  content: ' ▸ ';
  //  padding: 0 0.5rem;
  //}
  //.header-subtitle {
  //  font-size: 1.2rem;
  //}
  //.container {
  //  max-width: 1200px;
  //  margin: 0 auto;
  //  padding: 1rem;
  //}
  //.search-panel {
  //  display: flex;
  //}
  //.search-panel__filters {
  //  flex: 1;
  //}
  //.search-panel__results {
  //  flex: 3;
  //}
  //.ais-Highlight-highlighted {
  //  color: inherit;
  //  font-size: inherit;
  //}
  //.searchbox {
  //  margin-bottom: 2rem;
  //}
  //.pagination {
  //  margin: 2rem auto;
  //  text-align: center;
  //}
  //.hit-name {
  //  font-size: 1.1rem;
  //  font-weight: bold;
  //  margin-top: 10px;
  //}
  //.hit-authors {
  //  margin-top: 3px;
  //  font-size: 0.8rem;
  //}
  //.hit-publication-year {
  //  font-size: 0.8rem;
  //  margin-top: 20px;
  //}
  //.hit-rating {
  //  margin-top: 3px;
  //  font-size: 0.8rem;
  //}
  //.ais-Hits-item {
  //  padding: 30px;
  //  box-shadow: none;
  //  border: 1px solid lighten(lightgray, 8%);
  //}

  .product-image-wrapper {
    text-align: center;
    width: 100%;
  }

  .product-image {
    //width: 100%;
    max-height: 100px;
    max-width: 100%;
    //height: 80px;
  }

  .shop-item-result {
    .item-title {
      font-size: 17px;
      margin-bottom: 20px;
    }
  }
}
</style>