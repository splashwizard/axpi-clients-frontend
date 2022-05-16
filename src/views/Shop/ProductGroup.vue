<template>
  <div>
    <!-- Is Loading -->
    <div class="loader" v-if="isLoading">
      <a-spin></a-spin>
    </div>
    <!-- / Is Loading -->

    <!-- Loaded -->
    <div v-if="!isLoading">
      <a-table class="axpi-table" :pagination="false" :columns="columns" :data-source="productsToShow">
        <template slot="price" slot-scope="price, row">
          {{ getPriceRange(row.id) }}
        </template>

        <template slot="actions" slot-scope="action, item">
          <div class="actions-wrapper">
            <a-input
              v-if="!isProductInBasket(item)"
              class="quantity-input"
              placeholder="1"
              v-model="quantities[item.id]"
              type="number"
            ></a-input>
            <a-button v-if="!isProductInBasket(item)" type="primary" @click.prevent="() => addToBasket(item)"
              >Add to basket
            </a-button>

            <div v-else class="quantity-changer">
              <a-button @click.prevent="() => decrementProductQuantity(item)" icon="minus"> </a-button>
              <div>
                <a-input
                  type="number"
                  @change="(e) => setProductQuantity({ quantity: e.target.value, id: item['id'] })"
                  :value="getQuantityOfProductInBasket(item)"
                ></a-input>
              </div>
              <!--                        <div>{{ getQuantityOfProductInBasket(item) }}</div>-->
              <a-button @click.prevent="() => incrementProductQuantity(item)" icon="plus"></a-button>
            </div>
          </div>
        </template>
      </a-table>
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import axios from "axios";

const _ = require("lodash");
import Orders from "../../mixins/Orders";
import { mapActions, mapGetters } from "vuex";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: 300,
  },
  {
    title: "Product Code",
    dataIndex: "productCode",
  },
  // {
  //   title: 'Catalog Code',
  //   dataIndex: 'catalogCode'
  // },
  {
    title: "Price",
    scopedSlots: { customRender: "price" },
    width: 150,
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
  },
];

export default {
  name: "ProductGroup",
  props: ["productCode", "product", "quantities"],
  mixins: [Orders],
  created() {
    if (this.productCode) {
      this.fetch();
    }
  },
  computed: {
    ...mapGetters("shop", {
      basket: "basket",
    }),

    prices() {
      if (this.group && this.group.prices) {
        return this.group.prices;
      }
      return [];
    },

    productsToShow() {
      if (this.group) {
        return this.group.hits;
        // return _.map(this.group.hits, 'document');
      }
      return [this.product];
    },
  },
  data() {
    return {
      isLoading: false,
      group: null,
      columns,
    };
  },
  methods: {
    ...mapActions("shop", {
      addProductToBasket: "addProductToBasket",
      incrementProductQuantity: "incrementProductQuantity",
      decrementProductQuantity: "decrementProductQuantity",
      setProductQuantity: "setProductQuantity",
    }),

    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/products/get-product-code-group", {
          product_code: vm.productCode,
        })
        .then((r) => {
          vm.isLoading = false;
          vm.group = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading group");
        });
    },

    getPriceRange(productId) {
      let prices = this.group.prices[productId];
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

    addToBasket(record) {
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

    getProductPageUrl(product) {
      return "/products/" + product["id"] + "?fromShop=1";
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
  },
};
</script>

<style scoped lang="scss">
.loader {
  text-align: center;
}

.actions-wrapper {
  max-width: 350px;
  flex-shrink: 1;
  //flex-grow: 1;
  display: flex;

  .quantity-input {
    margin-right: 10px;
  }

  .ant-input {
    width: 90px;
  }
}
</style>
