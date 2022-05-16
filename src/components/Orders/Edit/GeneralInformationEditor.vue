<template>
  <div class="axpi-form width-medium">
    <!-- Customer Information -->
    <!--    <div class="form-section" v-if="user.supplier">-->
    <!--      <div class="form-header">-->
    <!--        <h2>Customer Information</h2>-->
    <!--      </div>-->
    <!--      <customer-information-->
    <!--          :client="orderLocal.client"-->
    <!--          :order-local="orderLocal"-->
    <!--          :organisational-unit="orderLocal.organisational_unit"></customer-information>-->
    <!--    </div>-->
    <!-- /Customer Information -->

    <!-- Product Information -->
    <div class="form-section">
      <div class="form-header">
        <h2>Product Information</h2>
      </div>
      <product-information :order-local="orderLocal"></product-information>
    </div>
    <!-- / Product Information -->

    <!-- Order Information -->
    <div class="form-section" v-if="type == 'order' || type == 'optimisation-specification'">
      <div class="form-header">
        <h2>Order Information</h2>
      </div>
      <order-information :suppliers="suppliers" :order-local="orderLocal"></order-information>
    </div>
    <!-- / Order Information -->

    <!-- Form footer -->
    <div class="form-footer">
      <a-button size="large" type="primary" @click="goToNextStage">
        Continue
        <a-icon type="arrow-right"></a-icon>
      </a-button>
    </div>
    <!-- / Form Footer -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import ProductInformation from "./GeneralInformationEditor/ProductInformation";
import OrderInformation from "./GeneralInformationEditor/OrderInformation";

export default {
  name: "GeneralInformationEditor",
  props: ["orderLocal", "suppliers"],
  components: { ProductInformation, OrderInformation },
  computed: {
    ...mapGetters("auth", {
      user: "user",
    }),

    ...mapGetters("orderEditor", {
      type: "type",
    }),
  },
  methods: {
    ...mapActions("orderEditor", {
      goToNextStage: "goToNextStage",
    }),
  },
};
</script>

<style scoped></style>
