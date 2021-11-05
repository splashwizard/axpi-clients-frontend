<template>
  <div class="shop-basket">
    <a-layout>
      <a-layout style="padding: 7px 30px">

        <div class="wrapper">
          <a-page-header title="Basket" @back="goBackToShop"></a-page-header>
        </div>

        <div class="table-wrapper">
          <a-table v-if="!isLoading" class="axpi-table column-dividers"
                   :columns="columns"
                   :data-source="basket"
                   :loading="isLoading"
          >

            <div slot="actions" slot-scope="actions, record">
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
          </a-table>
        </div>

      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name: "Basket",
  data() {
   return {
     columns: [
       {
         title: 'Name',
         dataIndex: 'name',
         width: 350,
       },
       {
         title: "",
         scopedSlots: {customRender: "actions"},
         width: 10
       },
     ]
   }
  },
  methods: {
    ...mapActions('shop', {
      incrementProductQuantity: 'incrementProductQuantity',
      decrementProductQuantity: 'decrementProductQuantity',

      incrementPastOrderQuantity: 'incrementPastOrderQuantity',
      decrementPastOrderQuantity: 'decrementPastOrderQuantity',

      incrementSpecificationQuantity: 'incrementSpecificationQuantity',
      decrementSpecificationQuantity: 'decrementSpecificationQuantity'
    }),

    goBackToShop() {
      this.$router.push('/shop');
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

<style scoped>
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
</style>