<template>
  <a-row :gutter="50">
    <a-col :span="12">
      <a-form layout="vertical">
        <a-form-item label="Supplier" v-if="suppliers && suppliers.length">
          <a-select size="large" style="width: 100%" v-model="orderLocal.supplier_id">
            <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
              {{ supplier.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Order Date">
          <a-date-picker style="width: 100%" size="large" v-model="orderLocal.order_date" placeholder="Order Date"/>
        </a-form-item>
        <a-form-item label="Date Delivered">
          <a-date-picker style="width: 100%" size="large" v-model="orderLocal.delivery_date"
                         placeholder="Delivery Date"/>
        </a-form-item>
        <a-form-item label="Price">
          <a-input-group compact>
            <a-input :addon-before="costCurrencyPrepend" size="large" class="order-cost-input" style="width: 70%" v-model="orderLocal.cost"/>
            <a-select default-value="GBP" size="large" style="width: 30%" v-model="orderLocal.cost_currency">
<!--              <a-select-option value="GBP">-->
<!--                GBP-->
<!--              </a-select-option>-->
<!--              <a-select-option value="USD">-->
<!--                USD-->
<!--              </a-select-option>-->
              <a-select-option v-for="currency in currencies" :value="currency.currency" :key="currency.currency">
                {{currency.currency}}
              </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>
        <a-form-item label="Quantity">
          <a-input size="large" type="large" style="width:100%;" v-model="orderLocal.quantity"></a-input>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
const currencies = [{'currency': 'AED', 'symbol': 'د.إ'}, {'currency': 'AUD', 'symbol': '$'}, {'currency': 'BDT', 'symbol': '৳'}, {'currency': 'BGN', 'symbol': 'лв'}, {'currency': 'BRL', 'symbol': 'R$'}, {'currency': 'CAD', 'symbol': '$'}, {'currency': 'CHF', 'symbol': 'CHF'}, {'currency': 'CLP', 'symbol': '$'}, {'currency': 'CNY', 'symbol': '¥'}, {'currency': 'COP', 'symbol': '$'}, {'currency': 'CZK', 'symbol': 'Kč'}, {'currency': 'DKK', 'symbol': 'kr'}, {'currency': 'EUR', 'symbol': '€'}, {'currency': 'GBP', 'symbol': '£'}, {'currency': 'GEL', 'symbol': '₾'}, {'currency': 'HKD', 'symbol': '$'}, {'currency': 'HRK', 'symbol': 'kn'}, {'currency': 'HUF', 'symbol': 'ft'}, {'currency': 'IDR', 'symbol': 'Rp'}, {'currency': 'ILS', 'symbol': '₪'}, {'currency': 'INR', 'symbol': '₹'}, {'currency': 'JPY', 'symbol': '¥'}, {'currency': 'KES', 'symbol': 'Ksh'}, {'currency': 'KRW', 'symbol': '₩'}, {'currency': 'LKR', 'symbol': 'Rs'}, {'currency': 'MAD', 'symbol': '.د.م'}, {'currency': 'MXN', 'symbol': '$'}, {'currency': 'MYR', 'symbol': 'RM'}, {'currency': 'NGN', 'symbol': '₦'}, {'currency': 'NOK', 'symbol': 'kr'}, {'currency': 'NZD', 'symbol': '$'}, {'currency': 'PEN', 'symbol': 'S/.'}, {'currency': 'PHP', 'symbol': '₱'}, {'currency': 'PKR', 'symbol': 'Rs'}, {'currency': 'PLN', 'symbol': 'zł'}, {'currency': 'RON', 'symbol': 'lei'}, {'currency': 'RUB', 'symbol': '₽'}, {'currency': 'SEK', 'symbol': 'kr'}, {'currency': 'SGD', 'symbol': '$'}, {'currency': 'THB', 'symbol': '฿'}, {'currency': 'TRY', 'symbol': '₺'}, {'currency': 'UAH', 'symbol': '₴'}, {'currency': 'USD', 'symbol': '$'}, {'currency': 'VND', 'symbol': '₫'}, {'currency': 'ZAR', 'symbol': 'R'}];

export default {
  name: "OrderInformation",
  props: ['orderLocal', 'suppliers'],
  data() {
   return {
    currencies
   }
  },
  computed: {
    costCurrencyPrepend() {
      let currency = _.find(currencies, {currency: this.orderLocal.cost_currency});
      if (currency) {
        return currency.symbol;
      } else {
        return '£';
      }
      // if (this.orderLocal.cost_currency === 'USD') {
      //   return '$';
      // }
      // if (this.orderLocal.cost_currency === 'GBP') {
      //  return '£';
      // }
      return null;
    }
  }
}
</script>

<style lang="scss">
.order-cost-input {
  .ant-input-group-addon {
    //background: none;
    box-shadow: none
  }
}
</style>
