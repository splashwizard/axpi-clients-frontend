<template>
  <a-row :gutter="70">
    <a-col :span="12">
      <a-form layout="vertical">
        <a-form-item label="Product Type">
          <a-select
            show-search
            v-model="orderLocal.pos_product_type"
            :disabled="isDropdownLoading('pos-product-type')"
            size="large"
          >
            <a-select-option v-for="type in productTypeOptions" :value="type.name" :key="type.name">
              {{ type.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Width">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_product_width" />
            <a-select default-value="cm" style="width: 25%" size="large" v-model="orderLocal.pos_product_width_unit">
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Depth">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_product_depth" />
            <a-select default-value="GBP" size="large" style="width: 25%" v-model="orderLocal.pos_product_depth_unit">
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Height">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_product_height" />
            <a-select default-value="GBP" style="width: 25%" size="large" v-model="orderLocal.pos_product_height_unit">
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Weight Supported">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_weight_supported" />
            <a-select default-value="g" style="width: 25%" size="large" v-model="orderLocal.pos_weight_supported_unit">
              <a-select-option value="g"> g </a-select-option>
              <a-select-option value="lbs"> lbs </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Usable Area of Shelves">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_usable_area_of_shelves" />
            <a-select
              default-value="g"
              style="width: 25%"
              size="large"
              v-model="orderLocal.pos_usable_area_of_shelves_unit"
            >
              <a-select-option value="m2"> m&sup2; </a-select-option>
              <a-select-option value="ft2"> ft&sup2; </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
// const PRODUCT_TYPE_OPTIONS = [
//   {
//     label: 'Floor Sticker',
//     value: 'Floor Sticker'
//   },
//   {
//     label: 'Leaflet Holder',
//     value: 'Leaflet Holder'
//   },
//   {
//     label: 'Bollard Cover',
//     value: 'Bollard Cover'
//   },
//   {
//     label: 'FSDU',
//     value: 'FSDU'
//   },
//   {
//     label: 'POS Display',
//     value: 'POS Display'
//   },
//   {
//     label: 'Window Sticker',
//     value: 'Window Sticker'
//   },
//   {
//     label: 'Hanging Sign',
//     value: 'Hanging Sign'
//   },
//   {
//     label: 'Shelf Wobbler',
//     value: 'Shelf Wobbler'
//   },
//   {
//     label: 'Counter Display Unit',
//     value: 'Counter Display Unit'
//   },
//   {
//     label: 'Product Dump Bin',
//     value: 'Product Dump Bin'
//   }
// ];

import Forms from "../../../../../mixins/Forms";
export default {
  name: "ProductDetails",
  props: ["orderLocal"],
  mixins: [Forms],
  data() {
    return {
      productTypeOptions: [],
    };
  },
  mounted() {
    this.getDropdownOptions("pos-product-type", "productTypeOptions");
  },
};
</script>

<style scoped></style>
