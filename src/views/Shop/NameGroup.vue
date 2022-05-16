<template>
  <div class="name-group-table">
    <!-- Is Loading -->
    <div class="loader" v-if="isLoading">
      <a-spin></a-spin>
    </div>
    <!-- / Is Loading -->

    <!-- Loaded -->
    <div v-if="!isLoading">
      <a-table
        class="axpi-table"
        :expandIconAsCell="false"
        :expand-icon="getExpandIcon"
        :expand-icon-column-index="3"
        :pagination="false"
        :columns="columns"
        :data-source="productsToShow"
      >
        <template slot="checkbox">
          <div class="checkbox-wrapper">
            <a-checkbox></a-checkbox>
          </div>
        </template>

        <table slot="expandedRowRender" slot-scope="item" class="axpi-table axpi-inner-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Price</th>
              <th>Catalog Code</th>
              <th>Availability</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="(row, i) in getPricesAndStockWithProductDetails(item)" :key="i">
            <tr>
              <td>{{ row.supplier_name }}</td>
              <td>
                {{ formatCostInPence2dp({ cost: row.price, cost_currency: row.price_currency }) }}
              </td>
              <td>
                {{ row.catalogCode }}
              </td>
              <!--            <td>-->
              <!--              <a-icon v-if="isInStock(row.price.stock)" type="check-circle" theme="twoTone"-->
              <!--                      two-tone-color="#52c41a"></a-icon>-->
              <!--              <a-icon v-if="isOutOfStock(row.price.stock)" type="close-circle" theme="twoTone"-->
              <!--                      two-tone-color="#FF0000"></a-icon>-->
              <!--              <span class="availability-text">{{ getStockText(row.price.stock, true, row.price.lead_time) }}</span>-->
              <!--            </td>-->
              <td>
                <a-icon
                  v-if="isInStock(row.stock)"
                  type="check-circle"
                  theme="twoTone"
                  two-tone-color="#52c41a"
                ></a-icon>
                <a-icon
                  v-if="isOutOfStock(row.stock)"
                  type="close-circle"
                  theme="twoTone"
                  two-tone-color="#FF0000"
                ></a-icon>
                <span class="availability-text">{{ getStockText(row.stock, true, row.lead_time) }}</span>
              </td>
              <td>
                <div class="actions-wrapper">
                  <a-input-group v-if="!isProductInBasket(item, row)" class="quantity-input-group" compact>
                    <a-button icon="minus" @click.prevent="() => decrementPreBasketQuantity(row.id)"></a-button>
                    <a-input
                      class="quantity-input"
                      placeholder="1"
                      v-model="quantities[row.id]"
                      type="number"
                    ></a-input>
                    <a-button icon="plus" @click.prevent="() => incrementPreBasketQuantity(row.id)"></a-button>
                  </a-input-group>

                  <a-button
                    v-if="!isProductInBasket(item, row)"
                    type="primary"
                    @click.prevent="() => addToBasket(item, row)"
                    >Add to basket
                  </a-button>

                  <div v-else class="quantity-changer">
                    <a-input-group compact>
                      <a-button
                        @click.prevent="() => decrementProductQuantity({ product: item, selectedPriceId: row.id })"
                        icon="minus"
                      >
                      </a-button>
                      <a-input
                        type="number"
                        @change="
                          (e) =>
                            setProductQuantity({ quantity: e.target.value, selectedPriceId: row.id, id: item['id'] })
                        "
                        :value="getQuantityOfProductInBasket(item, row)"
                      ></a-input>
                      <!--                        <div>{{ getQuantityOfProductInBasket(item) }}</div>-->
                      <a-button
                        @click.prevent="() => incrementProductQuantity({ product: item, selectedPriceId: row.id })"
                        icon="plus"
                      ></a-button>
                    </a-input-group>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="5" class="no-padding-top">
                <a-tag color="red" v-if="row.supplier_certifications && row.supplier_certifications.length == 0"
                  >No certifications
                </a-tag>
                <div v-if="row.supplier_certifications && row.supplier_certifications.length">
                  <a-tag
                    color="blue"
                    v-for="(certification, i) in row.supplier_certifications"
                    :key="getCertificationKey(i)"
                    >{{ certification.name }}
                  </a-tag>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!--        <a-table slot="expandedRowRender"-->
        <!--                 slot-scope="item"-->
        <!--                 :columns="innerColumns"-->
        <!--                 :data-source="getPricesAndStockWithProductDetails(item)"-->
        <!--                 :pagination="false">-->
        <!--          <template slot="price" slot-scope="price, record">-->
        <!--            {{ formatCostInPence2dp({cost: price, cost_currency: record.price_currency}) }}-->
        <!--          </template>-->
        <!--          <template slot="actions" slot-scope="actions, row">-->
        <!--            <div class="actions-wrapper">-->

        <!--              <a-input-group v-if="!isProductInBasket(item, row)"-->
        <!--                             class="quantity-input-group" compact>-->
        <!--                <a-button icon="minus" @click.prevent="() => decrementPreBasketQuantity(row.id)"></a-button>-->
        <!--                <a-input class="quantity-input" placeholder="1"-->
        <!--                         v-model="quantities[row.id]" type="number"></a-input>-->
        <!--                <a-button icon="plus" @click.prevent="() => incrementPreBasketQuantity(row.id)"></a-button>-->
        <!--              </a-input-group>-->

        <!--              <a-button v-if="!isProductInBasket(item, row)"-->
        <!--                        type="primary" @click.prevent="() => addToBasket(item, row)">Add to basket-->
        <!--              </a-button>-->

        <!--              <div v-else class="quantity-changer">-->
        <!--                <a-input-group compact>-->
        <!--                  <a-button @click.prevent="() => decrementProductQuantity({product:item, selectedPriceId: row.id})"-->
        <!--                            icon="minus">-->
        <!--                  </a-button>-->
        <!--                  <a-input type="number"-->
        <!--                           @change="e => setProductQuantity({quantity: e.target.value, selectedPriceId: row.id, id: item['id']})"-->
        <!--                           :value="getQuantityOfProductInBasket(item, row)"></a-input>-->
        <!--                  &lt;!&ndash;                        <div>{{ getQuantityOfProductInBasket(item) }}</div>&ndash;&gt;-->
        <!--                  <a-button @click.prevent="() => incrementProductQuantity({product: item, selectedPriceId: row.id})"-->
        <!--                            icon="plus"></a-button>-->
        <!--                </a-input-group>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--          <template slot="availability" slot-scope="availability, price">-->
        <!--            <a-icon v-if="isInStock(price.stock)" type="check-circle" theme="twoTone"-->
        <!--                    two-tone-color="#52c41a"></a-icon>-->
        <!--            <a-icon v-if="isOutOfStock(price.stock)" type="close-circle" theme="twoTone"-->
        <!--                    two-tone-color="#FF0000"></a-icon>-->
        <!--            <span class="availability-text">{{ getStockText(price.stock, true, price.lead_time) }}</span>-->
        <!--          </template>-->
        <!--        </a-table>-->

        <template slot="productCode" slot-scope="productCode, row">
          <router-link style="font-weight: 500" :to="getProductPageUrl(row)">
            {{ productCode }}
          </router-link>
          <approved-badge v-if="row.certified" style="margin-left: 30px"></approved-badge>
        </template>

        <!--        <template slot="price" slot-scope="price, row">-->
        <!--          {{ getPriceRange(row.id) }}-->
        <!--        </template>-->
      </a-table>

      <div class="show-more-toggle" v-if="canShowMore">
        <a @click.prevent="showMore" v-if="!isShowingMore"
          >Show More
          <a-icon :style="{ fontSize: '10px' }" type="down" />
        </a>
        <a @click.prevent="showLess" v-if="isShowingMore"
          >Show Less
          <a-icon :style="{ fontSize: '10px' }" type="up" />
        </a>
      </div>
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import axios from "axios";

const _ = require("lodash");
import Orders from "../../mixins/Orders";
import StockManagement from "../../mixins/StockManagement";
import { mapActions, mapGetters } from "vuex";
import ApprovedBadge from "../Products/Show/ApprovedBadge";

const columns = [
  {
    title: "Compare",
    scopedSlots: { customRender: "checkbox" },
    width: 100,
  },
  // {
  //   title: 'Name',
  //   dataIndex: 'name',
  //   scopedSlots: {customRender: 'name'},
  //   width: 300
  // },
  {
    title: "Product Code",
    dataIndex: "productCode",
    scopedSlots: { customRender: "productCode" },
  },
  // {
  //   title: 'Price',
  //   scopedSlots: {customRender: 'price'},
  //   width: 150
  // },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
  },
  {
    title: "Pricing",
    width: 80,
  },
];

const innerColumns = [
  {
    title: "Supplier",
    dataIndex: "supplier_name",
  },
  {
    title: "Price",
    dataIndex: "price",
    scopedSlots: { customRender: "price" },
  },
  {
    title: "Catalog Code",
    dataIndex: "catalogCode",
  },
  {
    title: "Availability",
    dataIndex: "availability",
    scopedSlots: { customRender: "availability" },
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
  },
];

export default {
  name: "NameGroup",
  components: { ApprovedBadge },
  props: ["name", "product", "quantities"],
  mixins: [Orders, StockManagement],
  created() {
    if (this.name) {
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

    canShowMore() {
      if (this.group && this.group.hits && this.group.hits.length > 5) {
        return true;
      }
      return false;
    },

    productsToShow() {
      if (this.group) {
        if (this.isShowingMore) {
          return this.group.hits;
        }
        return this.group.hits.slice(0, 5);
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
      innerColumns,
      isShowingMore: false,
    };
  },
  methods: {
    ...mapActions("shop", {
      addProductToBasket: "addProductToBasket",
      incrementProductQuantity: "incrementProductQuantity",
      decrementProductQuantity: "decrementProductQuantity",
      setProductQuantity: "setProductQuantity",
    }),

    getCertificationKey(i) {
      return "certification-" + Math.random() + "-" + i;
    },

    showMore() {
      this.isShowingMore = true;
    },

    showLess() {
      this.isShowingMore = false;
    },

    decrementPreBasketQuantity(id) {
      if (this.quantities[id] && !isNaN(this.quantities[id])) {
        this.quantities[id]--;
        if (this.quantities[id] < 1) {
          this.quantities[id] = 1;
        }
      } else {
        this.quantities[id] = 1;
      }
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    incrementPreBasketQuantity(id) {
      if (this.quantities[id] && !isNaN(this.quantities[id])) {
        this.quantities[id]++;
      } else {
        this.quantities[id] = 1;
      }
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/products/get-name-group", {
          name: vm.name,
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

    getPrices(productId) {
      return this.group.prices[productId];
    },

    getPricesAndStockWithProductDetails(product) {
      return _.map(this.group.prices[product.id], (price) => ({
        ...price,
        catalogCode: product.catalogCode,
        stock: this.getStockForProduct(product.id, price.supplier_id),
        lead_time: this.getLeadTimeForProduct(product.id, price.supplier_id),
        supplier_certifications: price.supplier_certifications,
      }));
    },

    getStockForProduct(productId, supplierId) {
      let stocks = this.group.stocks[productId];
      let stock = _.find(stocks, { supplier_id: supplierId });
      return stock !== undefined ? stock.stock : null;
    },

    getLeadTimeForProduct(productId, supplierId) {
      let stocks = this.group.stocks[productId];
      let stock = _.find(stocks, { supplier_id: supplierId });
      return stock !== undefined ? stock.lead_time : null;
    },

    // getPriceRange(productId) {
    //   let prices = this.group.prices[productId];
    //   if (prices && prices.length) {
    //     let ordered = _.orderBy(prices, 'price');
    //     let minPrice = _.first(ordered);
    //     let maxPrice = _.last(ordered);
    //
    //     if (minPrice !== maxPrice) {
    //       let minPriceFormatted = this.formatCostInPence2dp({
    //         cost: minPrice.price,
    //         cost_currency: 'USD'
    //       });
    //
    //       let maxPriceFormatted = this.formatCostInPence2dp({
    //         cost: maxPrice.price,
    //         cost_currency: 'USD'
    //       });
    //
    //       return minPriceFormatted + ' - ' + maxPriceFormatted;
    //     } else {
    //       return this.formatCostInPence2dp({
    //         cost: minPrice.price,
    //         cost_currency: 'USD'
    //       });
    //     }
    //   }
    //   return '-';
    // },

    addToBasket(record, price) {
      let prices = this.prices[record["id"]];
      if (!prices) {
        prices = [];
      }

      let priceToUse = price;
      if (!priceToUse) {
        priceToUse = _.first(prices);
      }

      let quantity = this.quantities[priceToUse.id];
      if (!quantity) {
        quantity = 1;
      }
      this.addProductToBasket({
        quantity: quantity,
        product: record,
        selectedPrice: priceToUse,
        selectedPriceId: priceToUse.id,
        prices: prices,
      });
    },

    getProductPageUrl(product) {
      return "/products/" + product["id"] + "?fromShop=1";
    },

    isProductInBasket(product, price) {
      return (
        _.filter(this.basket, (item) => {
          return item.itemType === "product" && item.id === product["id"] && item.selectedPriceId === price.id;
        }).length > 0
      );
    },

    getQuantityOfProductInBasket(product, price) {
      return _.find(this.basket, (item) => {
        return item.itemType === "product" && item.id === product["id"] && item.selectedPriceId === price.id;
      }).quantity;
    },

    getExpandIcon({ expanded, record, onExpand }) {
      return (
        <a-button
          style="font-weight: 500; padding-left: 0; padding-right; 0;"
          type="link"
          {...{
            on: {
              click: onExpand.bind(this, [expanded, record]),
            },
          }}
        >
          <span>{expanded ? "Hide" : "Expand"}</span>
          <a-icon style="font-size: 10px; font-weight: 500;" type={expanded ? "up" : "down"}></a-icon>
        </a-button>
      );
    },
  },
};
</script>

<style lang="scss">
.name-group-table {
  .loader {
    text-align: center;
  }

  tr td:last-child {
    //text-align: right;
  }

  .actions-wrapper {
    float: right;
    max-width: 350px;
    flex-shrink: 1;
    //flex-grow: 1;
    display: flex;

    .quantity-input-group {
      margin-right: 10px;
    }

    .quantity-input {
      //margin-right: 10px;
      -moz-appearance: textfield;
      text-align: center;
      padding-left: 7px;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    .ant-input {
      width: 70px;
    }
  }

  .show-more-toggle {
    margin-top: 20px;
    font-weight: 500;
  }

  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -5px 0 10px 0 !important;
  }

  .ant-table-expanded-row tbody tr:last-child td {
    border-bottom: none;
  }

  .availability-text {
    margin-left: 10px;
  }
}

.checkbox-wrapper {
  //text-align: center;
}
</style>
