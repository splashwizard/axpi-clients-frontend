<template>
  <div class="shop-basket">
    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <a-page-header title="Basket" @back="goBackToShop">
            <template slot="extra">
              <a-button icon="shopping-cart" type="primary">Checkout</a-button>
            </template>
          </a-page-header>
        </div>

        <edit-order-modal :suppliers="suppliers" v-if="order && (type === 'order' || type === 'specification')">
        </edit-order-modal>

        <div class="table-wrapper" :key="tableUpdateKey">
          <a-table
            v-if="!isLoading"
            class="axpi-table"
            :columns="columns"
            :pagination="false"
            :data-source="basket"
            :loading="isLoading"
          >
            <div slot="name" slot-scope="name, record">
              <router-link v-if="record.itemType == 'product'" :to="getProductPageUrl(record)">{{ name }} </router-link>
              <a v-if="record.itemType == 'order'" href="#" @click.prevent="editOrder(record.order)">{{ name }} </a>
              <a
                v-if="record.itemType == 'specification'"
                href="#"
                @click.prevent="editSpecification(record.specification)"
                >{{ name }}
              </a>
            </div>

            <div slot="image" slot-scope="image, row">
              <a-avatar size="large" :src="getImageSrc(row)" />
            </div>

            <div slot="quantity" slot-scope="quantity, record">
              <!-- Product -->
              <div v-if="record.itemType === 'product'" class="quantity-changer">
                <a-input-group compact>
                  <a-button
                    @click.prevent="
                      () =>
                        decrementProductQuantity({ product: record.product, selectedPriceId: record.selectedPriceId })
                    "
                    icon="minus"
                  >
                  </a-button>
                  <!--                  <div>{{ record.quantity }}</div>-->
                  <a-input
                    type="number"
                    class="quantity-input"
                    @change="
                      (e) =>
                        setProductQuantity({
                          quantity: e.target.value,
                          id: record['id'],
                          selectedPriceId: record.selectedPriceId,
                        })
                    "
                    :value="record.quantity"
                  ></a-input>
                  <a-button
                    @click.prevent="
                      () =>
                        incrementProductQuantity({ product: record.product, selectedPriceId: record.selectedPriceId })
                    "
                    icon="plus"
                  ></a-button>
                </a-input-group>
              </div>
              <!-- / Product -->
              <!-- Order -->
              <div v-if="record.itemType === 'order'" class="quantity-changer">
                <a-input-group compact>
                  <a-button @click.prevent="() => decrementPastOrderQuantity(record.order)" icon="minus"> </a-button>
                  <a-input
                    type="number"
                    class="quantity-input"
                    @change="(e) => setPastOrderQuantity({ quantity: e.target.value, id: record['id'] })"
                    :value="record.quantity"
                  ></a-input>
                  <a-button @click.prevent="() => incrementPastOrderQuantity(record.order)" icon="plus"></a-button>
                </a-input-group>
              </div>
              <!-- / Order -->
              <!-- Specification -->
              <div v-if="record.itemType === 'specification'" class="quantity-changer">
                <a-input-group compact>
                  <a-button @click.prevent="() => decrementSpecificationQuantity(record.specification)" icon="minus">
                  </a-button>
                  <a-input
                    type="number"
                    class="quantity-input"
                    @change="(e) => setSpecificationQuantity({ quantity: e.target.value, id: record['id'] })"
                    :value="record.quantity"
                  ></a-input>
                  <a-button
                    @click.prevent="() => incrementSpecificationQuantity(record.specification)"
                    icon="plus"
                  ></a-button>
                </a-input-group>
              </div>
              <!-- / Specification -->
            </div>

            <div slot="supplier" slot-scope="supplier, record">
              <a-select
                :value="record.selectedPrice.id"
                v-if="!record.isLoadingPrices && record.prices && record.selectedPrice"
                option-filter-prop="children"
                :filter-option="filterOption"
                show-search
                @change="(e) => selectPriceById(record, e)"
                style="width: 200px"
              >
                <a-select-option v-for="(price, i) in record.prices" :value="price.id" :key="i">
                  {{ price.supplier_name }}
                </a-select-option>
              </a-select>
              <span v-else>
                <a-spin size="small" v-if="record.isLoadingPrices"></a-spin>
                <span v-else>No suppliers</span>
              </span>
              <!--              <a-dropdown>-->
              <!--                <a class="ant-dropdown-link" @click="e => e.preventDefault()">-->
              <!--                  {{ record.selectedPrice ? record.selectedPrice.supplier_name : 'Select supplier' }}-->
              <!--                  <a-icon type="down"/>-->
              <!--                </a>-->
              <!--                <a-menu slot="overlay">-->
              <!--                  <a-menu-item v-for="(price, i) in record.prices" :key="i">-->
              <!--                    <a href="#" @click.prevent="() => selectPrice(record, price)">{{ price.supplier_name }}</a>-->
              <!--                  </a-menu-item>-->
              <!--                </a-menu>-->
              <!--              </a-dropdown>-->
            </div>

            <div slot="cost" slot-scope="cost, record">
              <a-spin v-if="record.isLoadingPrices" size="small"></a-spin>
              <div v-if="!record.isLoadingPrices">
                <!-- Suggested -->
                <div v-if="getSavingType(record) === 'Suggested'">
                  <span>
                    {{
                      record.selectedPrice
                        ? formatCostInPence2dp({
                            cost: getPriceToShow(record.selectedPrice.price, record.quantity, record.itemType),
                            cost_currency: "USD",
                          })
                        : "-"
                    }}
                  </span>
                  <!--                  <a-tag-->
                  <!--                      v-if="record.prices && record.itemType !== 'product' && record.selectedPrice"-->
                  <!--                      color="blue" style="margin-left: 5px;">Suggested-->
                  <!--                  </a-tag>-->
                </div>
                <!-- / Suggested -->

                <!-- Exact -->
                <div v-if="getSavingType(record) === 'Exact'">
                  <span>
                    {{
                      record.selectedPrice
                        ? formatCostInPence2dp({
                            cost: record.order.cost,
                            cost_currency: "USD",
                          })
                        : "-"
                    }}
                  </span>
                  <!--                  <a-tag-->
                  <!--                      color="blue" style="margin-left: 5px;">Exact-->
                  <!--                  </a-tag>-->
                </div>
                <!-- / Exact -->

                <!-- Savings -->
                <div style="margin-top: 10px" v-if="record.prices && record.selectedPrice">
                  <span>{{
                    getSavings(record)
                      ? formatCostInPence2dp({
                          cost: getSavings(record),
                          cost_currency: "USD",
                        })
                      : "-"
                  }}</span>
                  <!--                  <a-tag-->
                  <!--                      :color="(getSavings(record) && getSavings(record) > 0) ? 'green' : 'red'"-->
                  <!--                      style="margin-left: 5px;">Savings-->
                  <!--                  </a-tag>-->
                </div>
                <!-- / Savings -->
              </div>
            </div>

            <div slot="cost-tags" slot-scope="cost, record">
              <a-spin v-if="record.isLoadingPrices" size="small"></a-spin>
              <div v-if="!record.isLoadingPrices">
                <div v-if="getSavingType(record) === 'Suggested'">
                  <a-tag v-if="record.prices && record.selectedPrice" color="blue" style="margin-left: 5px"
                    >Suggested
                  </a-tag>
                </div>
                <div v-if="getSavingType(record) === 'Exact'">
                  <a-tag color="blue" style="margin-left: 5px">Exact </a-tag>
                </div>
                <div style="margin-top: 10px" v-if="record.prices && record.selectedPrice">
                  <a-tag
                    :color="getSavings(record) && getSavings(record) > 0 ? 'green' : 'red'"
                    style="margin-left: 5px"
                    >Savings
                  </a-tag>
                </div>
              </div>
            </div>

            <div slot="co2e" slot-scope="co2e, record">
              <a-spin v-if="record.isLoadingPrices" size="small"></a-spin>
              <span v-else>
                <span v-if="getTotalCo2e(record)">{{ getTotalCo2e(record) }} kg</span>
                <a-tag color="red" v-else>Unknown</a-tag>
              </span>
            </div>

            <div slot="actions" slot-scope="actions, row">
              <div class="actions">
                <request-quote-button v-if="row.itemType !== 'product'"></request-quote-button>
              </div>
            </div>

            <div slot="expandedRowRender" slot-scope="record">
              <basket-row-inner :row="record"></basket-row-inner>
            </div>

            <!--            <a-table slot="expandedRowRender" slot-scope="record" :columns="record.innerColumns" :data-source="record.innerRows" :pagination="false">-->

            <!--            </a-table>-->

            <!--            <a-table-->
            <!--                slot="expandedRowRender"-->
            <!--                slot-scope="record"-->
            <!--                :columns="innerColumns"-->
            <!--                :data-source="record.prices"-->
            <!--                :pagination="false"-->
            <!--            >-->
            <!--              <div slot="cost" slot-scope="cost, record">-->
            <!--                {{-->
            <!--                  record.price ? formatCostInPence2dp({-->
            <!--                    cost: record.price,-->
            <!--                    cost_currency: 'USD'-->
            <!--                  }) : '-'-->
            <!--                }}-->
            <!--              </div>-->
            <!--              <div slot="co2e" slot-scope="co2e">-->
            <!--                <span v-if="getSupplierCo2e(co2e, record)">-->
            <!--                  {{ getSupplierCo2e(co2e, record) }} kg-->
            <!--                </span>-->
            <!--                <a-tag color="red" v-else>Unknown</a-tag>-->
            <!--              </div>-->
            <!--            </a-table>-->
          </a-table>
        </div>

        <div class="optimise-wrapper">
          <optimise-basket></optimise-basket>
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Orders from "../../mixins/Orders";
import { mapGetters, mapActions } from "vuex";
import OptimiseBasket from "./Basket/OptimiseBasket";
import RequestQuoteButton from "./Basket/RequestQuoteButton";
import EditOrderModal from "../../components/Orders/EditOrderModal";
import axios from "axios";
import eventBus from "../../event-bus";
import BasketRowInner from "./Basket/BasketRowInner";

const _ = require("lodash");

const innerColumns = [
  { title: "Supplier", dataIndex: "supplier_name", key: "supplier_name" },
  { title: "Cost", dataIndex: "cost", key: "cost", scopedSlots: { customRender: "cost" } },
  { title: "CO2e", dataIndex: "co2e", key: "co2e", scopedSlots: { customRender: "co2e" } },
];

export default {
  name: "Basket",
  mixins: [Orders],
  components: { BasketRowInner, RequestQuoteButton, OptimiseBasket, EditOrderModal },
  data() {
    return {
      innerColumns,
      columns: [
        {
          title: "",
          width: 20,
          scopedSlots: { customRender: "image" },
        },
        {
          title: "Name",
          dataIndex: "name",
          width: 200,
          scopedSlots: { customRender: "name" },
        },
        {
          title: "Quantity",
          dataIndex: "quantity",
          scopedSlots: { customRender: "quantity" },
          width: 140,
        },
        {
          title: "Supplier",
          dataIndex: "supplier",
          scopedSlots: { customRender: "supplier" },
          width: 130,
        },
        {
          title: "Cost",
          dataIndex: "cost",
          scopedSlots: { customRender: "cost" },
          width: 110,
        },
        {
          title: "",
          dataIndex: "cost",
          key: "cost-tags",
          scopedSlots: { customRender: "cost-tags" },
          width: 180,
        },
        {
          title: "CO2e",
          dataIndex: "co2e",
          scopedSlots: { customRender: "co2e" },
          width: 100,
        },
        {
          title: "",
          scopedSlots: { customRender: "actions" },
          width: 10,
        },
      ],
      suppliers: [],
      isLoadingSuppliers: false,
    };
  },
  created() {
    this.loadSuppliers();
    console.log("basket", this.basket);

    let vm = this;

    eventBus.$on("specification-updated", function (params) {
      let p = _.find(vm.basket, (item) => {
        return item.itemType === "specification" && item.id === params.id;
      });
      vm.loadTruepricesForSpecification({
        spec: { id: params.id },
        quantity: p.quantity,
      });
    });

    eventBus.$on("order-updated", function (params) {
      let p = _.find(vm.basket, (item) => {
        return item.itemType === "order" && item.id === params.id;
      });
      vm.loadTruepricesForOrder({
        order: { id: params.id },
        quantity: p.quantity,
      });
    });
  },
  methods: {
    ...mapActions("shop", {
      incrementProductQuantity: "incrementProductQuantity",
      decrementProductQuantity: "decrementProductQuantity",
      setProductQuantity: "setProductQuantity",

      incrementPastOrderQuantity: "incrementPastOrderQuantity",
      decrementPastOrderQuantity: "decrementPastOrderQuantity",
      setPastOrderQuantity: "setPastOrderQuantity",

      incrementSpecificationQuantity: "incrementSpecificationQuantity",
      decrementSpecificationQuantity: "decrementSpecificationQuantity",
      setSpecificationQuantity: "setSpecificationQuantity",

      updateBasketSelectedPrice: "updateBasketSelectedPrice",
      loadTruepricesForSpecification: "loadTruepricesForSpecification",
      loadTruepricesForOrder: "loadTruepricesForOrder",
    }),

    ...mapActions("orderEditor", {
      setWizardStage: "setWizardStage",
      loadOrder: "loadOrder",
      loadSpecification: "loadSpecification",
    }),

    getSavingType(row) {
      let prices = _.map(row.prices, "price");
      let benchmarkPrice = _.mean(prices) * 1.3;

      // let savingFromBenchmark = (benchmarkPrice - row.selectedPrice.price);

      if (row.order && row.order.cost) {
        // let savingComparedToBefore = (row.order.cost - row.selectedPrice.price);
        let isSupplierSame = row.order.supplier_id == row.selectedPrice.supplier_id;
        if (row.order.cost < benchmarkPrice && isSupplierSame) {
          return "Exact";
        }
      }

      return "Suggested";
    },

    getSavings(row) {
      let prices = _.map(row.prices, "price");
      let benchmarkPrice = _.mean(prices) * 1.3;

      let savingFromBenchmark = benchmarkPrice - row.selectedPrice.price;

      if (row.order && row.order.cost) {
        let savingComparedToBefore = row.order.cost - row.selectedPrice.price;

        // let isSupplierSame = row.order.supplier_id == row.selectedPrice.supplier_id;
        if (row.order.cost < benchmarkPrice) {
          return savingComparedToBefore;
        }
      }

      if (row.suggestedProducts && row.suggestedProducts.length) {
        let orderedByCost = _.orderBy(row.suggestedProducts, "cost");
        let lowestPrice = _.first(orderedByCost).cost;
        let savingComparedToBefore = lowestPrice - row.selectedPrice.price;
        if (lowestPrice < benchmarkPrice) {
          return savingComparedToBefore * row.quantity;
        }
      }

      return savingFromBenchmark;

      // return (benchmarkPrice - row.selectedPrice.price);
    },

    loadSuppliers() {
      let vm = this;
      vm.isLoadingSuppliers = true;
      axios
        .get(window.API_BASE + "/suppliers")
        .then((r) => {
          vm.suppliers = r.data;
          vm.isLoadingSuppliers = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoadingSuppliers = false;
          vm.$message.error("Error loading suppliers");
        });
    },

    editOrder(order) {
      this.setWizardStage(0);
      this.loadOrder(order.id);
    },

    editSpecification(specification) {
      this.setWizardStage(0);
      this.loadSpecification(specification.id);
    },

    getPriceToShow(price, quantity, itemType) {
      if (itemType === "product") {
        return price * quantity;
      }
      return price;
    },

    getTotalCo2e(item) {
      let co2e = 0;
      if (item.itemType === "product" && item.selectedPrice && item.selectedPrice.co2e) {
        co2e = Math.round(item.quantity * item.selectedPrice.co2e * 100) / 100;
      } else if (item.selectedPrice && item.selectedPrice.co2e) {
        co2e = Math.round(item.selectedPrice.co2e * 100) / 100;
      }
      return co2e ? co2e : 0;
    },

    getSupplierCo2e(co2e, item) {
      let co2eToReturn = co2e;
      if (item.itemType === "product") {
        co2eToReturn = co2eToReturn * item.quantity;
      }
      return co2eToReturn ? Math.round(co2eToReturn * 100) / 100 : 0;
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },

    getProductPageUrl(product) {
      return "/products/" + product["id"] + "?fromBasket=1";
    },

    getOrderUrl(order) {
      return "/orders/" + order.id;
    },

    goBackToShop() {
      this.$router.push("/shop");
    },

    getImageSrc(item) {
      if (item["product"] && item["product"]["imageURLs"] && item["product"]["imageURLs"].length) {
        return item["product"]["imageURLs"][0];
      }
      return "/img/icons/basket-order-icon.png";
    },

    selectPrice(record, price) {
      this.updateBasketSelectedPrice({
        selectedPrice: price,
        basketItem: record,
      });
    },

    selectPriceById(record, priceId) {
      this.updateBasketSelectedPrice({
        selectedPrice: _.find(record.prices, { id: priceId }),
        basketItem: record,
      });
    },

    getExpandIcon({ expanded, record, onExpand }) {
      return (
        <a-button
          style="font-weight: 500; padding-left: 0; padding-right; 0; float: right;"
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
  computed: {
    ...mapGetters("shop", {
      basket: "basket",
      isLoading: "isLoading",
      tableUpdateKey: "tableUpdateKey",
    }),

    ...mapGetters("orderEditor", {
      order: "order",
      type: "type",
    }),
  },
};
</script>

<style scoped lang="scss">
.shop-basket {
}

.wrapper {
  max-height: 100%;
  overflow-y: scroll;
}

.quantity-changer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .quantity-input {
    width: calc(100% - 32px - 32px);
    -moz-appearance: textfield;
    text-align: center;
    padding-left: 7px;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.ant-table-expanded-row-level-1 {
  .ant-table-wrapper {
    margin-top: -13px !important;
    margin-bottom: 0;
  }
}

.actions {
  text-align: right;
}

.optimise-wrapper {
  margin-top: 60px;
  margin-bottom: 40px;
}

.text-success {
  color: #52c41a;
}
</style>
