<template>
  <div class="shop-index">
    <loading-screen :is-loading="isLoading || isEnriching"></loading-screen>

    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <a-page-header title="Shop">
            <template slot="extra">
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

              <a-button icon="shopping" @click="goToBasket">
                <span style="margin-right: 5px">Basket</span> <span v-if="basket.length">({{ basket.length }})</span>
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
              >
                <a-select slot="addonBefore" default-value="Search all" style="width: 120px">
                  <a-select-option value="all"> Search all </a-select-option>
                </a-select>
              </a-input-search>
            </div>
            <div class="right">
              <add-spec-to-basket-button-and-modal></add-spec-to-basket-button-and-modal>
            </div>
          </div>
          <!-- / Search -->

          <!-- Specs display mode -->
          <div class="table-wrapper" v-if="displayMode === 'specs' && tableData && tableData.length">
            <a-table
              v-if="!(isLoading || isEnriching)"
              class="axpi-table column-dividers"
              :scroll="{ x: 'max-content' }"
              :columns="columns"
              :data-source="tableData"
              :pagination="pagination"
              @change="handleTableChange"
              :loading="isLoading || isEnriching"
            >
              <div slot="image" slot-scope="image, row">
                <a-avatar size="large" :src="getImageSrc(row)" />
              </div>

              <div slot="name" slot-scope="name, row">
                <a :href="getProductPageUrl(row)">{{ name }}</a>
              </div>

              <div slot="datasheet" slot-scope="datasheet, row">
                <span>
                  <a :href="row.URL" target="_blank">
                    <a-icon type="link"></a-icon>
                    Datasheet
                  </a>
                </span>
              </div>

              <div slot="price">?</div>

              <div slot="numberOfAuthorisedSellers">1</div>

              <div slot="marketAvailability">1</div>

              <div v-for="(p, i) in uniqueProperties" :slot="p" :key="i" slot-scope="property">
                <span v-html="property"></span>
              </div>

              <div slot="actions" slot-scope="actions, record">
                <div class="table-add-to-basket-wrapper">
                  <a-input
                    v-if="!isProductInBasket(record)"
                    class="quantity-input"
                    placeholder="1"
                    type="number"
                    v-model="quantities[record.id]"
                  ></a-input>

                  <a-button
                    v-if="!isProductInBasket(record)"
                    class="add-to-basket-button"
                    type="primary"
                    @click.prevent="() => addToBasket(record)"
                    >Add to basket
                  </a-button>
                </div>

                <div v-if="isProductInBasket(record)" class="quantity-changer">
                  <a-button @click.prevent="() => decrementProductQuantity(record)" icon="minus"> </a-button>
                  <!--                  <div>{{ getQuantityOfProductInBasket(record) }}</div>-->
                  <div>
                    <a-input
                      type="number"
                      @change="(e) => setProductQuantity({ quantity: e.target.value, id: record['_id'] })"
                      :value="getQuantityOfProductInBasket(record)"
                    ></a-input>
                  </div>
                  <a-button @click.prevent="() => incrementProductQuantity(record)" icon="plus"></a-button>
                </div>
              </div>
            </a-table>
          </div>
          <!-- / Specs display mode -->

          <!-- Prices display mode -->
          <div class="prices-list-wrapper" v-if="displayMode === 'prices' && tableData && tableData.length">
            <a-list item-layout="horizontal" :data-source="tableData" :pagination="pagination">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta>
                  <div slot="title">
                    <div class="title-wrapper">
                      <div class="left">
                        <a :href="getProductPageUrl(item)">{{ item.name }}</a>
                      </div>
                      <div class="right">
                        <span class="price">£100 / something</span>
                      </div>
                    </div>
                  </div>
                  <div slot="description">
                    <p>
                      <b>{{ item.manufacturer }}</b>
                    </p>
                    <p>
                      {{ item.description }}
                    </p>
                    <div class="price-list-actions-wrapper">
                      <div class="left"></div>
                      <div class="right">
                        <a-input
                          v-if="!isProductInBasket(item)"
                          class="quantity-input"
                          placeholder="1"
                          v-model="quantities[item.id]"
                          type="number"
                        ></a-input>
                        <a-button
                          v-if="!isProductInBasket(item)"
                          type="primary"
                          @click.prevent="() => addToBasket(item)"
                          >Add to basket
                        </a-button>

                        <div v-else class="quantity-changer">
                          <a-button @click.prevent="() => decrementProductQuantity(item)" icon="minus"> </a-button>
                          <div>
                            <a-input
                              type="number"
                              @change="(e) => setProductQuantity({ quantity: e.target.value, id: item['_id'] })"
                              :value="getQuantityOfProductInBasket(item)"
                            ></a-input>
                          </div>
                          <!--                        <div>{{ getQuantityOfProductInBasket(item) }}</div>-->
                          <a-button @click.prevent="() => incrementProductQuantity(item)" icon="plus"></a-button>
                        </div>
                      </div>
                    </div>
                    <!--                    <div class="price-list-actions-wrapper">-->
                    <!--                      <a-button v-if="!isProductInBasket(item)"-->
                    <!--                                type="primary" @click.prevent="() => addProductToBasket(item)">Add to basket-->
                    <!--                      </a-button>-->

                    <!--                      <div v-else class="quantity-changer">-->
                    <!--                        <a-button @click.prevent="() => decrementProductQuantity(item)"-->
                    <!--                                  icon="minus">-->
                    <!--                        </a-button>-->
                    <!--                        <div>-->
                    <!--                          <a-input type="number"-->
                    <!--                                   @change="e => setProductQuantity({quantity: e.target.value, id: item['_id']})"-->
                    <!--                                   :value="getQuantityOfProductInBasket(item)"></a-input>-->
                    <!--                        </div>-->
                    <!--                        &lt;!&ndash;                        <div>{{ getQuantityOfProductInBasket(item) }}</div>&ndash;&gt;-->
                    <!--                        <a-button @click.prevent="() => incrementProductQuantity(item)"-->
                    <!--                                  icon="plus"></a-button>-->
                    <!--                      </div>-->
                    <!--                    </div>-->
                  </div>
                  <a-avatar size="large" shape="square" slot="avatar" :src="getImageSrc(item)" />
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
          <!-- / Prices display mode -->
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Units from "../mixins/Units";
import AddSpecToBasketButtonAndModal from "./Shop/AddSpecToBasketButtonAndModal";

const _ = require("lodash");

export default {
  name: "Shop",
  components: { AddSpecToBasketButtonAndModal },
  mixins: [Units],
  data() {
    return {
      quantities: {},
    };
  },
  computed: {
    ...mapGetters("shop", {
      searchResults: "searchResults",
      isLoading: "isLoading",
      searchQuery: "searchQuery",
      tablePagination: "tablePagination",
      basket: "basket",
      enriched: "enriched",
      displayMode: "displayMode",
      isEnriching: "isEnriching",
    }),

    display_mode: {
      get() {
        return this.displayMode;
      },
      set(val) {
        this.setDisplayMode(val);
      },
    },

    search_query: {
      get() {
        return this.searchQuery;
      },
      set(val) {
        this.setSearchQuery(val);
      },
    },

    pagination: {
      get() {
        return this.tablePagination;
      },
      set(val) {
        this.setTablePagination(val);
      },
    },

    uniqueProperties() {
      let properties = [];
      _.each(Object.values(this.enriched), (ps) => {
        properties.push(_.map(ps, "propertyName"));
        properties = _.flatten(properties);
      });
      return _.uniq(properties);
    },

    columns() {
      return [
        {
          title: "",
          width: 60,
          fixed: "left",
          scopedSlots: { customRender: "image" },
        },
        {
          title: "Name",
          dataIndex: "name",
          width: 350,
          fixed: "left",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "Market Data",
          children: [
            {
              title: "",
              dataIndex: "datasheet",
              scopedSlots: { customRender: "datasheet" },
            },
            {
              title: "Price",
              dataIndex: "price",
              scopedSlots: { customRender: "price" },
            },
            {
              title: "Number of authorised sellers",
              dataIndex: "numberOfAuthorisedSellers",
              scopedSlots: { customRender: "numberOfAuthorisedSellers" },
            },
            {
              title: "Market availability",
              dataIndex: "marketAvailability",
              scopedSlots: { customRender: "marketAvailability" },
            },
          ],
        },
        {
          title: "Most Relevant",
          children: [
            ..._.map(this.uniqueProperties, (p) => ({
              title: p,
              dataIndex: p,
              sorter: false,
              width: 200,
              scopedSlots: { customRender: p },
            })),
          ],
        },
        {
          title: "",
        },
        {
          title: "",
          scopedSlots: { customRender: "actions" },
          width: 250,
          fixed: "right",
        },
      ];
    },

    tableData() {
      // return this.searchResults.data;
      return _.map(this.searchResults.data, (product) => {
        _.each(this.uniqueProperties, (p) => {
          let property = _.find(product.all_properties, {
            propertyName: p,
          });
          if (property) {
            if (property.variableType && property.variableType === "categorical") {
              product[p] = property.propertyValue;
            } else {
              let magnitudeFormatted = property.propertyValue;
              if (magnitudeFormatted < 1 && magnitudeFormatted !== 0) {
                let exp = Number.parseFloat(magnitudeFormatted).toExponential(3);
                let split = exp.split("e");
                magnitudeFormatted = split[0] + " x 10" + "<sup>" + split[1] + "</sup>";
              }

              let propertyUnitFormatted = this.formatUnit(property.propertyUnit);
              product[p] = magnitudeFormatted + " " + propertyUnitFormatted;
            }
          } else {
            product[p] = "";
          }
        });
        return product;
      });
    },
  },
  created() {
    // this.search();
  },
  methods: {
    ...mapActions("shop", {
      search: "search",
      setSearchQuery: "setSearchQuery",
      setTablePagination: "setTablePagination",
      addProductToBasket: "addProductToBasket",
      incrementProductQuantity: "incrementProductQuantity",
      decrementProductQuantity: "decrementProductQuantity",
      setProductQuantity: "setProductQuantity",
      setDisplayMode: "setDisplayMode",
    }),

    addToBasket(record) {
      let quantity = this.quantities[record["id"]];
      if (!quantity) {
        quantity = 1;
      }
      this.addProductToBasket({
        quantity: quantity,
        product: record,
      });
    },

    getProductPageUrl(product) {
      return "/products/" + product["id"] + "?fromShop=1";
    },

    getImageSrc(order) {
      if (order["imageURLs"] && order["imageURLs"].length) {
        return order["imageURLs"][0];
      }
    },

    goToBasket() {
      this.$router.push("/shop/basket");
    },

    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      // this.setTablePagination(pager);
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
      return (
        _.filter(this.basket, (item) => {
          return item.itemType === "product" && item.id === product["_id"];
        }).length > 0
      );
    },

    getQuantityOfProductInBasket(product) {
      return _.find(this.basket, (item) => {
        return item.itemType === "product" && item.id === product["_id"];
      }).quantity;
    },
  },
};
</script>

<style scoped lang="scss">
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
  margin-top: 25px;
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

  .price-list-actions-wrapper {
    //margin-bottom: 10px;

    display: flex;

    .left {
      flex-grow: 1;
    }

    .right {
      max-width: 250px;
      flex-shrink: 1;
      display: flex;

      .quantity-input {
        margin-right: 10px;
      }
    }

    .ant-input {
      width: 110px;
    }
  }
}

.wrapper {
  max-height: 100%;
  overflow-y: scroll;
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
</style>
