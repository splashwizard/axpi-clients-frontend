<template>
  <a-row :gutter="50">
    <a-col :span="12">
      <a-form layout="vertical">
        <a-form-item label="Product Name">
          <a-input size="large" v-model="orderLocal.product_name" placeholder="Product Name"/>
        </a-form-item>
        <a-form-item label="Product Description">
          <a-input size="large" v-model="orderLocal.product_description" placeholder="Product Description"/>
        </a-form-item>
        <a-form-item v-if="type == 'order'" label="Reference Number">
          <a-input size="large" v-model="orderLocal.reference_number" placeholder="Reference Number"/>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col :span="12" v-if="type == 'order'">
      <product-images-uploader></product-images-uploader>
    </a-col>
  </a-row>
</template>

<script>
import ProductImagesUploader from "./ProductInformation/ProductImagesUploader";
import {mapGetters} from 'vuex';

export default {
  name: "ProductInformation",
  props: ['orderLocal'],
  components: {ProductImagesUploader},
  computed: {
    ...mapGetters('orderEditor', {
      type: 'type'
    })
  }
}
</script>

<style scoped lang="scss">
</style>
