<template>
  <div>
    <!-- Specs display mode -->
    <ais-hits>
      <!--      <template slot-scope="{items}">-->
      <template>
        <a-table
          class="axpi-table column-dividers"
          :scroll="{ x: 'max-content' }"
          :columns="columns"
          :loading="isEnriching"
          :pagination="false"
          :data-source="itemsWithEnrichedAddedIn"
        >
          <div slot="image" slot-scope="image, row">
            <a-avatar size="large" :src="getImageSrc(row)" />
          </div>

          <div slot="name" slot-scope="name, item">
            <router-link :to="getProductPageUrl(item)">{{ item["name"] }}</router-link>
          </div>

          <div slot="datasheet" slot-scope="datasheet, row">
            <span>
              <a :href="row.URL" target="_blank">
                <a-icon type="link"></a-icon>
                Datasheet
              </a>
            </span>
          </div>

          <div slot="price" slot-scope="price, item">{{ price }}{{ item }}</div>

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
      </template>
    </ais-hits>
    <!-- / Specs display mode -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import { connectHitsWithInsights } from "instantsearch.js/es/connectors";
import { createWidgetMixin } from "vue-instantsearch/src/mixins/widget";
import Units from "../../mixins/Units";
import Orders from "../../mixins/Orders";

const _ = require("lodash");

export default {
  name: "SpecsDisplay",
  props: ["quantities", "prices", "isLoadingPrices"],
  data() {
    return {
      isEnriching: false,
      enriched: [],
      updateKey: 1,
    };
  },
  mixins: [Units, Orders, createWidgetMixin({ connector: connectHitsWithInsights })],
  watch: {
    "state.hits"() {
      if (this.state.hits && this.state.hits.length) {
        this.enrichInBackground();
      }
    },
  },
  computed: {
    ...mapGetters("shop", {
      basket: "basket",
    }),

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
          width: 250,
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
            // {
            //   title: 'Price',
            //   dataIndex: 'price',
            //   scopedSlots: {customRender: 'price'}
            // },
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
        // {
        //   title: "",
        //   scopedSlots: {customRender: "actions"},
        //   width: 250,
        //   fixed: 'right'
        // },
      ];
    },

    itemsWithEnrichedAddedIn() {
      // return this.state.hits
      return _.map(this.state.hits, (product) => {
        _.each(this.uniqueProperties, (p) => {
          let productProperties = this.enriched[product.id];
          if (!productProperties) {
            productProperties = [];
          }
          let property = _.find(productProperties, {
            propertyName: p,
          });
          if (property) {
            if (property.variableType && property.variableType === "categorical") {
              product[p] = property.propertyValue;
            } else {
              // let magnitudeFormatted = property.propertyValue;
              // if (magnitudeFormatted < 1 && magnitudeFormatted !== 0) {
              //   let exp = Number.parseFloat(magnitudeFormatted).toExponential(3);
              //   let split = exp.split('e');
              //   magnitudeFormatted = split[0] + ' x 10' + '<sup>' + split[1] + '</sup>'
              // }
              //
              // let propertyUnitFormatted = this.formatUnit(property.propertyUnit);
              // product[p] = magnitudeFormatted + ' ' + propertyUnitFormatted;

              let magnitudeFormatted = property.normalisedUnitMagnitude;
              if (magnitudeFormatted < 1 && magnitudeFormatted !== 0) {
                let exp = Number.parseFloat(magnitudeFormatted).toExponential(3);
                let split = exp.split("e");
                magnitudeFormatted = split[0] + " x 10" + "<sup>" + split[1] + "</sup>";
              }

              let propertyUnitFormatted = this.formatUnit(property.normalisedUnitBase);
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
  methods: {
    ...mapActions("shop", {
      addProductToBasket: "addProductToBasket",
      incrementProductQuantity: "incrementProductQuantity",
      decrementProductQuantity: "decrementProductQuantity",
      setProductQuantity: "setProductQuantity",
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
      if (prices !== undefined) {
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

    enrichInBackground() {
      let vm = this;
      vm.isEnriching = true;
      vm.enriched = [];
      axios
        .post(window.API_BASE + "/products/enrich-many", {
          ids: _.map(this.state.hits, "id"),
        })
        .then((r) => {
          vm.enriched = r.data;
          vm.isEnriching = false;
          // if (vm.updateKey == 1) {
          //   vm.updateKey += 1;
          // }
        })
        .catch((e) => {
          console.log(e);
          vm.enriched = [];
          vm.isEnriching = false;
          vm.$message.error("Error enriching product data");
        });
    },
  },
};
</script>

<style scoped></style>
