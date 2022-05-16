<template>
  <div>
    <div>
      <!-- Paper -->
      <div class="form-section" v-if="['leaflet', 'brochure', 'book', 'poster', 'business_card'].includes(subtype)">
        <div class="form-header">
          <h2>Paper</h2>
        </div>
        <paper-details :order-local="orderLocal"></paper-details>
      </div>
      <!-- / Paper -->

      <!-- Binding -->
      <div class="form-section" v-if="['brochure', 'book'].includes(subtype)">
        <div class="form-header">
          <h2>Binding</h2>
        </div>
        <binding-details :order-local="orderLocal"></binding-details>
      </div>
      <!-- / Binding -->

      <!-- Envelope -->
      <div class="form-section" v-if="['envelope'].includes(subtype)">
        <div class="form-header">
          <h2>Envelope</h2>
        </div>
        <envelope-details :order-local="orderLocal"></envelope-details>
      </div>
      <!-- / Envelope -->

      <!-- Additional Info -->
      <div class="form-section">
        <div class="form-header">
          <h2>Additional Info</h2>
        </div>
        <additional-info :order-local="orderLocal"></additional-info>
      </div>
    </div>
  </div>
</template>

<script>
import PaperDetails from "./PrintSpecificationEditor/PaperDetails";
import BindingDetails from "./PrintSpecificationEditor/BindingDetails";
import EnvelopeDetails from "./PrintSpecificationEditor/EnvelopeDetails";
import AdditionalInfo from "./PrintSpecificationEditor/AdditionalInfo";
export default {
  name: "PrintSpecificationEditor",
  components: { PaperDetails, BindingDetails, AdditionalInfo, EnvelopeDetails },
  props: ["orderLocal"],
  computed: {
    subtype() {
      return this.orderLocal.product_subtype;
    },
  },
};
</script>

<style scoped></style>
