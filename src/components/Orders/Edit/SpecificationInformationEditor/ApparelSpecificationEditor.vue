<template>
  <div class="axpi-form width-large">
    <!-- Basic Details -->
    <div class="form-section">
      <div class="form-header">
        <h2>Basic Details</h2>
      </div>
      <t-shirt-details v-if="orderLocal.product_subtype === 't-shirt'" :order-local="orderLocal"></t-shirt-details>

      <hoodie-details v-if="orderLocal.product_subtype === 'hoodie'" :order-local="orderLocal"></hoodie-details>

      <sweater-details v-if="orderLocal.product_subtype === 'sweater'" :order-local="orderLocal"></sweater-details>

      <!-- Size -->
      <a-form layout="vertical">
        <a-row :gutter="70">
          <a-col :span="12">
            <a-form-item label="Size">
              <a-select
                v-model="orderLocal.apparel_size"
                :disabled="isDropdownLoading('apparel-size')"
                show-search
                size="large"
              >
                <a-select-option v-for="size in sizeOptions" :value="size.name" :key="size.name">
                  {{ size.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- / Size -->

      <!-- Quantity -->
      <!--            <a-form layout="vertical">-->
      <!--                <a-row :gutter="70">-->
      <!--                    <a-col :span="12">-->
      <!--                        <a-form-item label="Quantity">-->
      <!--                            <a-input type="number"-->
      <!--                                    v-model="orderLocal.apparel_quantity"-->
      <!--                            size="large">-->
      <!--                            </a-input>-->
      <!--                        </a-form-item>-->
      <!--                    </a-col>-->
      <!--                </a-row>-->
      <!--            </a-form>-->
      <!-- Quantity -->

      <!-- Item Mass -->
      <a-form layout="vertical">
        <a-row :gutter="70">
          <a-col span="12">
            <a-form-item label="Mass">
              <a-input-group compact>
                <a-input size="large" style="width: 70%" v-model="orderLocal.apparel_mass" />
                <a-select default-value="g" style="width: 30%" size="large" v-model="orderLocal.apparel_mass_unit">
                  <a-select-option value="g"> g </a-select-option>
                  <a-select-option value="lbs"> lbs </a-select-option>
                </a-select>
              </a-input-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- / Item Mass -->

      <!-- Printing Method -->
      <a-form layout="vertical">
        <a-row :gutter="70">
          <a-col :span="12">
            <a-form-item label="Printing Method">
              <a-select
                v-model="orderLocal.printing_method"
                :disabled="isDropdownLoading('apparel-printing-method')"
                show-search
                size="large"
              >
                <a-select-option v-for="method in printingMethodOptions" :value="method.name" :key="method.name">
                  {{ method.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- / Printing Method -->
    </div>
    <!-- / Basic Details -->

    <!-- Materials -->
    <div class="form-section">
      <div class="form-header">
        <h2>Materials</h2>
      </div>
      <material-used-editor :order-local="orderLocal"></material-used-editor>
    </div>
    <!-- / Materials -->
  </div>
</template>

<script>
import HoodieDetails from "./ApparelSpecificationEditor/HoodieDetails";
import SweaterDetails from "./ApparelSpecificationEditor/SweaterDetails";
import TShirtDetails from "./ApparelSpecificationEditor/TShirtDetails";
import MaterialUsedEditor from "./ApparelSpecificationEditor/MaterialUsedEditor";

// const SIZE_OPTIONS = [
//     'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'
// ];

// const PRINTING_METHOD_OPTIONS = [
//   {
//     label: 'No Printing',
//     value: 'no-printing'
//   },
//   {
//     label: 'Screen Printing',
//     value: 'screen-printing'
//   },
//   {
//     label: 'DTG Printing',
//     value: 'dtg-printing'
//   },
//   {
//     label: 'Dye-Sublimation Printing',
//     value: 'dye-sublimation-printing'
//   },
//   {
//     label: 'Plastisol Transfer Printing',
//     value: 'plastisol-transfer-printing'
//   },
//   {
//     label: 'CAD-Cut Heat Transfer Printing',
//     value: 'cad-cut-heat-transfer-printing'
//   }
// ];

import Forms from "../../../../mixins/Forms";

export default {
  name: "ApparelSpecificationEditor",
  components: { HoodieDetails, SweaterDetails, TShirtDetails, MaterialUsedEditor },
  props: ["orderLocal"],
  mixins: [Forms],
  data() {
    return {
      printingMethodOptions: [],
      sizeOptions: [],
    };
  },
  mounted() {
    this.getDropdownOptions("apparel-size", "sizeOptions");
    this.getDropdownOptions("apparel-printing-method", "printingMethodOptions");
  },
};
</script>

<style scoped></style>
