<template>
  <div class="shop-index">
    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <a-row :gutter="20" class="shop-topbar">
            <a-col :span="5">
              <ais-panel>
                <ais-clear-refinements></ais-clear-refinements>
              </ais-panel>
            </a-col>
            <a-col :span="19" class="shop-topbar-right">
              <div class="left">
                <ais-stats>
                  <template v-slot="{ hitsPerPage, nbHits, page, query }">
                    Showing {{ page * hitsPerPage + 1 }} -
                    {{
                      (((page * hitsPerPage) + 1 + hitsPerPage) &lt; nbHits) ? ((page * hitsPerPage) + 1 + hitsPerPage) : nbHits
                    }}
                    of {{ nbHits }} results for
                    <span class="stats-search-query">"{{ query }}"</span>
                  </template>
                </ais-stats>
              </div>
              <div class="right" style="display: none">
                <a-radio-group v-model="display_mode">
                  <a-radio-button value="prices">
                    <span style="margin-right: 3px">$</span>
                    Prices
                  </a-radio-button>
                  <a-radio-button value="specs">
                    <a-icon style="margin-right: 5px" type="form"></a-icon>
                    Specs
                  </a-radio-button>
                </a-radio-group>
              </div>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="5" style="padding-left: 17px">
              <ais-state-results>
                <template v-slot="{ results: { hits } }">
                  <shop-filter-options :results="hits" />
                </template>
              </ais-state-results>
            </a-col>
            <a-col :span="19" style="padding-right: 17px">
              <shop-items-list
                :displayMode="displayMode"
                :prices="prices"
                :isLoadingPrices="isLoadingPrices"
                :quantities="quantities"
              />
            </a-col>
          </a-row>
          <!-- / Instant search -->
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Units from "../mixins/Units";
import axios from "axios";
import Orders from "../mixins/Orders";
import ShopItemsList from "@/components/ShopItemsList";
import ShopFilterOptions from "@/components/ShopFilterOptions";

const _ = require("lodash");

import { connectHitsWithInsights } from "instantsearch.js/es/connectors";
import { createWidgetMixin } from "vue-instantsearch/src/mixins/widget";

export default {
  name: "Shop",
  components: {
    ShopItemsList,
    ShopFilterOptions,
  },
  mixins: [Units, Orders, createWidgetMixin({ connector: connectHitsWithInsights })],
  watch: {
    "state.hits"() {
      if (this.state.hits && this.state.hits.length) {
        // this.enrichWithPrices()
      }
    },
  },
  data() {
    return {
      quantities: {},
      isLoadingPrices: false,
      prices: [],
    };
  },
  computed: {
    ...mapGetters("shop", {
      displayMode: "displayMode",
      basket: "basket",
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
      },
    },
  },
  created() {
    // this.search();
  },
  methods: {
    ...mapActions("shop", {
      addProductToBasket: "addProductToBasket",
      incrementProductQuantity: "incrementProductQuantity",
      decrementProductQuantity: "decrementProductQuantity",
      setProductQuantity: "setProductQuantity",
      setDisplayMode: "setDisplayMode",
    }),

    addToBasket(record) {
      if (this.isLoadingPrices) {
        return false;
      }

      let prices = this.prices[record["id"]];
      if (!prices) {
        prices = [];
      }

      let quantity = this.quantities[record["id"]];
      if (!quantity) {
        quantity = 1;
      }
      this.addProductToBasket({
        quantity: quantity,
        product: record,
        selectedPrice: _.first(prices),
        prices: prices,
      });
    },

    goToBasket() {
      this.$router.push("/shop/basket");
    },

    isProductInBasket(product) {
      return (
        _.filter(this.basket, (item) => {
          return item.itemType === "product" && item.id === product["id"];
        }).length > 0
      );
    },

    getQuantityOfProductInBasket(product) {
      return _.find(this.basket, (item) => {
        return item.itemType === "product" && item.id === product["id"];
      }).quantity;
    },

    getPriceRange(productId) {
      let prices = this.prices[productId];
      if (prices && prices.length) {
        let ordered = _.orderBy(prices, "price");
        let minPrice = _.first(ordered);
        let maxPrice = _.last(ordered);

        if (minPrice !== maxPrice) {
          let minPriceFormatted = this.formatCostInPence2dp({
            cost: minPrice.price,
            cost_currency: "USD",
          });

          let maxPriceFormatted = this.formatCostInPence2dp({
            cost: maxPrice.price,
            cost_currency: "USD",
          });

          return minPriceFormatted + " - " + maxPriceFormatted;
        } else {
          return this.formatCostInPence2dp({
            cost: minPrice.price,
            cost_currency: "USD",
          });
        }
      }
      return "-";
    },

    enrichWithPrices() {
      let vm = this;
      vm.isLoadingPrices = true;
      vm.prices = [];
      axios
        .post(window.API_BASE + "/products/get-prices-for-many", {
          ids: _.map(this.state.hits, "id"),
        })
        .then((r) => {
          vm.prices = r.data;
          vm.isLoadingPrices = false;
        })
        .catch((e) => {
          console.log(e);
          vm.prices = [];
          vm.isLoadingPrices = false;
          vm.$message.error("Error loading product prices");
        });
    },
  },
};
</script>

<style lang="scss">
.shop-index {
  // .shop-index {
  // }

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

    .left {
      flex-grow: 1;
    }

    .right {
      max-width: 350px;
      flex-shrink: 1;
      //flex-grow: 1;
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
    overflow-y: auto;
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
}

.ais-SearchBox-input {
  box-shadow: none;
}

.ais-RefinementList-checkbox {
  box-shadow: none;
}

.ais-ClearRefinements-button:disabled[disabled] {
  background-image: none !important;
}

.shop-topbar {
  padding-top: 10px;
}

.shop-topbar-right {
  display: flex;

  .left {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;
    align-items: center;
    flex-shrink: 1;
  }
}

.stats-search-query {
  color: #993300;
  font-weight: bold;
}

.product-top {
  display: flex;

  .left {
    flex-grow: 1;
    display: flex;
  }

  .right {
    flex-shrink: 1;
    min-width: 100px;
    text-align: right;
    font-weight: 500;
  }
}

.sort-by-wrapper {
  margin-left: 10px;
  margin-right: 10px;

  .ais-SortBy-select {
    height: 32px;
    line-height: 25px;
  }
}

.product-group {
  margin-top: 25px;
}
</style>
