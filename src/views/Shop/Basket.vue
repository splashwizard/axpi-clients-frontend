<template>
  <div class="shop-basket">
    <a-layout>
      <a-layout style="padding: 7px 30px">

        <div class="wrapper">
          <a-page-header title="Basket" @back="goBackToShop">
            <template slot="extra">
              <a-button type="primary">Checkout</a-button>
            </template>
          </a-page-header>
        </div>

        <div class="table-wrapper">
          <a-table v-if="!isLoading" class="axpi-table"
                   :columns="columns"
                   :pagination="false"
                   :data-source="basket"
                   :loading="isLoading"
          >

            <div slot="image" slot-scope="image, row">
              <a-avatar
                  size="large"
                  :src="getImageSrc(row)"
              />
            </div>

            <div slot="quantity" slot-scope="quantity, record">
              <!-- Product -->
              <div v-if="record.itemType === 'product'" class="quantity-changer">
                <a-button @click.prevent="() => decrementProductQuantity(record.product)"
                          icon="minus">
                </a-button>
                <div>{{ record.quantity }}</div>
                <a-button @click.prevent="() => incrementProductQuantity(record.product)"
                          icon="plus"></a-button>
              </div>
              <!-- / Product -->
              <!-- Order -->
              <div v-if="record.itemType === 'order'" class="quantity-changer">
                <a-button @click.prevent="() => decrementPastOrderQuantity(record.order)"
                          icon="minus">
                </a-button>
                <div>{{ record.quantity }}</div>
                <a-button @click.prevent="() => incrementPastOrderQuantity(record.order)"
                          icon="plus"></a-button>
              </div>
              <!-- / Order -->
              <!-- Specification -->
              <div v-if="record.itemType === 'specification'" class="quantity-changer">
                <a-button @click.prevent="() => decrementSpecificationQuantity(record.specification)"
                          icon="minus">
                </a-button>
                <div>{{ record.quantity }}</div>
                <a-button @click.prevent="() => incrementSpecificationQuantity(record.specification)"
                          icon="plus"></a-button>
              </div>
              <!-- / Specification -->
            </div>

            <div slot="supplier" slot-scope="supplier, record">
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  {{ record.selectedPrice ? record.selectedPrice.supplier_name : 'Select supplier' }}
                  <a-icon type="down"/>
                </a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="(price, i) in record.prices" :key="i">
                    <a href="#" @click.prevent="() => selectPrice(record, price)">{{ price.supplier_name }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>

            <div slot="cost" slot-scope="cost, record">
              {{
                record.selectedPrice ? formatCostInPence2dp({
                  cost: record.selectedPrice.price,
                  cost_currency: 'USD'
                }) : '-'
              }}
            </div>

            <div slot="actions">
              <div class="actions">
                <a-button>Request Quote</a-button>
              </div>
            </div>

            <a-table
                slot="expandedRowRender"
                slot-scope="record"
                :columns="innerColumns"
                :data-source="record.prices"
                :pagination="false"
            >
              <div slot="cost" slot-scope="cost, record">
                {{
                  record.price ? formatCostInPence2dp({
                    cost: record.price,
                    cost_currency: 'USD'
                  }) : '-'
                }}
              </div>
            </a-table>
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
import {mapGetters, mapActions} from 'vuex';
import OptimiseBasket from "./Basket/OptimiseBasket";

const innerColumns = [
  {title: 'Supplier', dataIndex: 'supplier_name', key: 'supplier_name'},
  {title: 'Cost', dataIndex: 'cost', key: 'cost', scopedSlots: {customRender: 'cost'}},
];

export default {
  name: "Basket",
  mixins: [Orders],
  components: {OptimiseBasket},
  data() {
    return {
      innerColumns,
      columns: [
        {
          title: '',
          width: 20,
          scopedSlots: {customRender: 'image'}
        },
        {
          title: 'Name',
          dataIndex: 'name',
          width: 200,
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          scopedSlots: {customRender: "quantity"},
          width: 80
        },
        {
          title: 'Supplier',
          dataIndex: 'supplier',
          scopedSlots: {customRender: "supplier"},
          width: 100
        },
        {
          title: 'Cost',
          dataIndex: 'cost',
          scopedSlots: {customRender: "cost"},
          width: 100
        },
        {
          title: "",
          scopedSlots: {customRender: "actions"},
          width: 10
        },
      ],
    }
  },
  methods: {
    ...mapActions('shop', {
      incrementProductQuantity: 'incrementProductQuantity',
      decrementProductQuantity: 'decrementProductQuantity',

      incrementPastOrderQuantity: 'incrementPastOrderQuantity',
      decrementPastOrderQuantity: 'decrementPastOrderQuantity',

      incrementSpecificationQuantity: 'incrementSpecificationQuantity',
      decrementSpecificationQuantity: 'decrementSpecificationQuantity',

      updateBasketSelectedPrice: 'updateBasketSelectedPrice'
    }),

    goBackToShop() {
      this.$router.push('/shop');
    },

    getImageSrc(item) {
      if (item['product'] && item['product']['imageURLs'] && item['product']['imageURLs'].length) {
        return item['product']['imageURLs'][0];
      }
    },

    selectPrice(record, price) {
      this.updateBasketSelectedPrice({
        selectedPrice: price,
        basketItem: record
      });
    }
  },
  computed: {
    ...mapGetters('shop', {
      basket: 'basket',
      isLoading: 'isLoading'
    })
  }
}
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
}
</style>