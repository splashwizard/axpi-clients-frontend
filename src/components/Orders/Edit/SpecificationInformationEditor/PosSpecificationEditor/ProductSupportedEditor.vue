<template>
  <a-row :gutter="70">
    <a-col :span="12">
      <a-form layout="vertical">
        <a-form-item label="Product Type Supported">
          <a-select
            :disabled="isDropdownLoading('pos-product-type-supported')"
            v-model="orderLocal.pos_product_type_supported"
            size="large"
          >
            <a-select-option v-for="(type, i) in productTypeSupportedOptions" :key="i" :value="type.name">
              {{ type.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Width">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_product_supported_width" />
            <a-select
              default-value="GBP"
              style="width: 25%"
              size="large"
              v-model="orderLocal.pos_product_supported_width_unit"
            >
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Depth">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_product_supported_depth" />
            <a-select
              default-value="GBP"
              size="large"
              style="width: 25%"
              v-model="orderLocal.pos_product_supported_depth_unit"
            >
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Height">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_product_supported_height" />
            <a-select
              default-value="GBP"
              style="width: 25%"
              size="large"
              v-model="orderLocal.pos_product_supported_height_unit"
            >
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Quantity">
          <a-input size="large" v-model="orderLocal.pos_product_supported_quantity"></a-input>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
// const PRODUCT_TYPE_SUPPORTED_OPTIONS = [
//     {
//         label: 'Bottles',
//         value: 'Bottles'
//     }
// ];

import Forms from "../../../../../mixins/Forms";

export default {
  name: "ProductSupportedEditor",
  props: ["orderLocal"],
  mixins: [Forms],
  data() {
    return {
      productTypeSupportedOptions: [],
    };
  },
  mounted() {
    this.getDropdownOptions("pos-product-type-supported", "productTypeSupportedOptions");
  },
  methods: {
    filter(inputValue, path) {
      return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
  },
};
</script>

<style scoped></style>
