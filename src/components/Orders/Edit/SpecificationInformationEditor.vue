<template>
  <div class="axpi-form width-large">
    <!-- Product Type -->
    <div class="form-section">
      <div class="form-header">
        <h2>Product Type</h2>
      </div>
      <div class="form-margin-bottom">
        <inline-validation-errors id="product-type"></inline-validation-errors>
        <product-type-selector :order-local="orderLocal"></product-type-selector>
      </div>

      <div class="form-header" v-if="orderLocal.product_type && orderLocal.product_type !== 'packaging'">
        <h2>Product Subtype</h2>
      </div>
      <inline-validation-errors
        v-if="orderLocal.product_type && orderLocal.product_type !== 'packaging'"
        id="product-subtype"
      ></inline-validation-errors>
      <product-subtype-selector
        v-if="orderLocal.product_type && orderLocal.product_type !== 'packaging'"
        :order-local="orderLocal"
        @property-updated="incrementUpdateKey"
      ></product-subtype-selector>
    </div>
    <!-- / Product Type -->

    <!-- Details = Details(product_type, product_subtype) -->
    <div :key="updateKey">
      <!-- Print Specification Editor -->
      <print-specification-editor
        v-if="orderLocal.product_type === 'print' && orderLocal.product_subtype"
        :order-local="orderLocal"
      ></print-specification-editor>
      <!-- / Print Specification Editor -->

      <!-- POS Specification Editor -->
      <pos-specification-editor
        v-if="orderLocal.product_type === 'pos' && orderLocal.product_subtype"
        :order-local="orderLocal"
      ></pos-specification-editor>
      <!-- / POS Specification Editor -->

      <!-- Apparel Specification Editor -->
      <apparel-specification-editor
        v-if="orderLocal.product_type === 'apparel' && orderLocal.product_subtype"
        :order-local="orderLocal"
      ></apparel-specification-editor>
      <!-- / Apparel Specification Editor -->

      <!-- Packaging Specification Editor -->
      <packaging-specification-editor
        v-if="orderLocal.product_type === 'packaging'"
        :order-local="orderLocal"
      ></packaging-specification-editor>
      <!-- / Packaging Specification Editor -->
    </div>
    <!-- / Details -->

    <!-- Form footer -->
    <div class="form-footer">
      <a-button size="large" @click="goToPreviousStage" class="button-space-right">
        <a-icon type="arrow-left"></a-icon>
        Go Back
      </a-button>

      <a-button size="large" type="primary" @click="goToNextStage">
        Continue
        <a-icon type="arrow-right"></a-icon>
      </a-button>
    </div>
    <!-- / Form Footer -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ProductTypeSelector from "./SpecificationInformationEditor/ProductTypeSelector";
import ProductSubtypeSelector from "./SpecificationInformationEditor/ProductSubtypeSelector";
import PrintSpecificationEditor from "./SpecificationInformationEditor/PrintSpecificationEditor";
import PosSpecificationEditor from "./SpecificationInformationEditor/PosSpecificationEditor";
import ApparelSpecificationEditor from "./SpecificationInformationEditor/ApparelSpecificationEditor";
import PackagingSpecificationEditor from "./SpecificationInformationEditor/PackagingSpecificationEditor";

export default {
  name: "SpecificationInformationEditor",
  props: ["orderLocal"],
  components: {
    ApparelSpecificationEditor,
    ProductTypeSelector,
    ProductSubtypeSelector,
    PrintSpecificationEditor,
    PosSpecificationEditor,
    PackagingSpecificationEditor,
  },
  data() {
    return {
      updateKey: 1,
    };
  },
  methods: {
    ...mapActions("orderEditor", {
      goToNextStage: "goToNextStage",
      goToPreviousStage: "goToPreviousStage",
    }),

    incrementUpdateKey() {
      this.updateKey = this.updateKey + 1;
    },
  },
};
</script>

<style scoped></style>
