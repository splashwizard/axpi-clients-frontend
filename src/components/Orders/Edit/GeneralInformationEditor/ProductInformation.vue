<template>
  <a-row :gutter="50">
    <a-col :span="12">
      <a-form layout="vertical">
        <validated-form-item label="Product Name" id="product-information-product-name">
          <a-input size="large" v-model="orderLocal.product_name" placeholder="Product Name" />
        </validated-form-item>
        <validated-form-item label="Product Description" id="product-information-product-description">
          <a-input size="large" v-model="orderLocal.product_description" placeholder="Product Description" />
        </validated-form-item>
        <validated-form-item
          v-if="type == 'order'"
          label="Reference Number"
          id="product-information-reference-number,product-information-reference-type"
        >
          <a-input-group compact>
            <a-input
              size="large"
              v-model="orderLocal.reference_number"
              style="width: 50%"
              placeholder="Reference Number"
            />
            <a-select size="large" style="width: 50%" v-model="orderLocal.reference_type">
              <a-select-option value="po-number"> PO Number </a-select-option>
              <a-select-option value="reference-number"> Reference Number </a-select-option>
            </a-select>
          </a-input-group>
        </validated-form-item>
      </a-form>
    </a-col>
    <a-col :span="12" v-if="type == 'order'">
      <product-images-uploader></product-images-uploader>
    </a-col>
  </a-row>
</template>

<script>
import ProductImagesUploader from "./ProductInformation/ProductImagesUploader";
import { mapGetters } from "vuex";

export default {
  name: "ProductInformation",
  props: ["orderLocal"],
  components: { ProductImagesUploader },
  computed: {
    ...mapGetters("orderEditor", {
      type: "type",
    }),
  },
};
</script>

<style scoped lang="scss"></style>
