<template>
  <div>
    <!-- Semi Permanent & Permanent Product Details -->
    <!--    <div class="form-section" v-if="orderLocal.product_subtype === 'semi_permanent'">-->
    <div
      class="form-section"
      v-if="orderLocal.product_subtype === 'semi_permanent' || orderLocal.product_subtype === 'permanent'"
    >
      <div class="form-header">
        <h2>Product Details</h2>
      </div>
      <product-details :order-local="orderLocal"></product-details>
    </div>
    <!-- / Semi Permanent & Permanent Product Details -->

    <!-- Cardboard Used (Semi Permanent) -->
    <div class="form-section" v-if="orderLocal.product_subtype === 'semi_permanent'">
      <div class="form-header">
        <h2>Material Used</h2>
      </div>
      <cardboard-used-editor :order-local="orderLocal"></cardboard-used-editor>
    </div>
    <!-- / Cardboard Used -->

    <!-- Product Supported -->
    <div class="form-section" v-if="orderLocal.product_subtype === 'semi_permanent'">
      <div class="form-header">
        <h2>Product Supported</h2>
      </div>
      <product-supported-editor :order-local="orderLocal"></product-supported-editor>
    </div>
    <!-- / Product Supported -->

    <!-- Permanent Basic Details -->
    <!--    <div class="form-section" v-if="orderLocal.product_subtype === 'permanent'">-->
    <!--      <div class="form-header">-->
    <!--        <h2>Product Details</h2>-->
    <!--      </div>-->
    <!--      <a-row :gutter="70">-->
    <!--        <a-col span="12">-->
    <!--          &lt;!&ndash; General Paper Details &ndash;&gt;-->
    <!--          <a-form layout="vertical">-->
    <!--            <a-form-item label="POS Type">-->
    <!--              <a-select v-model="orderLocal.semi_permanent_pos_type"-->
    <!--                        show-search size="large">-->
    <!--                <a-select-option v-for="type in posTypeOptions" :value="type.value"-->
    <!--                                 :key="type.value">-->
    <!--                  {{ type.label }}-->
    <!--                </a-select-option>-->
    <!--              </a-select>-->
    <!--            </a-form-item>-->

    <!--            <a-form-item label="Width">-->
    <!--              <a-input-group compact>-->
    <!--                <a-input size="large" style="width: 75%" v-model="orderLocal.pos_display_width"/>-->
    <!--                <a-select default-value="GBP" style="width: 25%" size="large"-->
    <!--                          v-model="orderLocal.pos_display_width_unit">-->
    <!--                  <a-select-option value="cm">-->
    <!--                    cm-->
    <!--                  </a-select-option>-->
    <!--                  <a-select-option value="inch">-->
    <!--                    inch-->
    <!--                  </a-select-option>-->
    <!--                </a-select>-->
    <!--              </a-input-group>-->
    <!--            </a-form-item>-->

    <!--            <a-form-item label="Depth">-->
    <!--              <a-input-group compact>-->
    <!--                <a-input size="large" style="width: 75%" v-model="orderLocal.pos_display_depth"/>-->
    <!--                <a-select default-value="cm" size="large" style="width: 25%"-->
    <!--                          v-model="orderLocal.pos_display_depth_unit">-->
    <!--                  <a-select-option value="cm">-->
    <!--                    cm-->
    <!--                  </a-select-option>-->
    <!--                  <a-select-option value="inch">-->
    <!--                    inch-->
    <!--                  </a-select-option>-->
    <!--                </a-select>-->
    <!--              </a-input-group>-->
    <!--            </a-form-item>-->

    <!--            <a-form-item label="Height">-->
    <!--              <a-input-group compact>-->
    <!--                <a-input size="large" style="width: 75%" v-model="orderLocal.pos_display_height"/>-->
    <!--                <a-select default-value="cm" style="width: 25%" size="large"-->
    <!--                          v-model="orderLocal.pos_display_height_unit">-->
    <!--                  <a-select-option value="cm">-->
    <!--                    cm-->
    <!--                  </a-select-option>-->
    <!--                  <a-select-option value="inch">-->
    <!--                    inch-->
    <!--                  </a-select-option>-->
    <!--                </a-select>-->
    <!--              </a-input-group>-->
    <!--            </a-form-item>-->

    <!--            <a-form-item label="Weight Supported">-->
    <!--              <a-input-group compact>-->
    <!--                <a-input size="large" style="width: 75%" v-model="orderLocal.pos_weight_supported"/>-->
    <!--                <a-select default-value="g" style="width: 25%" size="large"-->
    <!--                          v-model="orderLocal.pos_weight_support_unit">-->
    <!--                  <a-select-option value="g">-->
    <!--                    g-->
    <!--                  </a-select-option>-->
    <!--                  <a-select-option value="lbs">-->
    <!--                    lbs-->
    <!--                  </a-select-option>-->
    <!--                </a-select>-->
    <!--              </a-input-group>-->
    <!--            </a-form-item>-->

    <!--            <a-form-item label="Usable Area of Shelves">-->
    <!--              <a-input-group compact>-->
    <!--                <a-input size="large" style="width: 75%" v-model="orderLocal.pos_usable_area_of_shelves"/>-->
    <!--                <a-select default-value="g" style="width: 25%" size="large"-->
    <!--                          v-model="orderLocal.pos_usable_area_of_shelves_unit">-->
    <!--                  <a-select-option value="m2">-->
    <!--                    m&sup2;-->
    <!--                  </a-select-option>-->
    <!--                  <a-select-option value="ft2">-->
    <!--                    ft&sup2;-->
    <!--                  </a-select-option>-->
    <!--                </a-select>-->
    <!--              </a-input-group>-->
    <!--            </a-form-item>-->

    <!--            <a-form-item label="Has Pegboard?">-->
    <!--              <a-radio-group @change="forceRefresh" v-model="orderLocal.has_pegboard"-->
    <!--                             button-style="solid">-->
    <!--                <a-radio-button v-for="option in hasPegboardOptions" :key="option.value"-->
    <!--                                :value="option.value">-->
    <!--                  {{ option.label }}-->
    <!--                </a-radio-button>-->
    <!--              </a-radio-group>-->
    <!--            </a-form-item>-->
    <!--          </a-form>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--    </div>-->
    <!-- / Permanent Basic Details -->

    <!-- Semi Permanent Material Used -->
    <div class="form-section" v-if="orderLocal.product_subtype === 'permanent'">
      <div class="form-header">
        <h2>Material Used</h2>
      </div>
      <material-used-editor :order-local="orderLocal"></material-used-editor>
    </div>
    <!-- / Semi Permanent Material Used -->

    <!-- Product Supported -->
    <div class="form-section" v-if="orderLocal.product_subtype === 'permanent'">
      <div class="form-header">
        <h2>Product Supported</h2>
      </div>
      <product-supported-editor :order-local="orderLocal"></product-supported-editor>
    </div>
    <!-- / Product Supported -->

    <!-- Display Information -->
    <!--    <div class="form-section" v-if="orderLocal.product_subtype === 'permanent'">-->
    <!--      <div class="form-header">-->
    <!--        <h2>Display Information</h2>-->
    <!--      </div>-->
    <!--      <display-information :order-local="orderLocal"></display-information>-->
    <!--    </div>-->
    <!-- / Display Information -->

    <!-- Additional Information -->
    <div class="form-section">
      <div class="form-header">
        <h2>Additional Information</h2>
      </div>
      <additional-info :order-local="orderLocal"></additional-info>
    </div>
    <!-- / Additional Information -->
  </div>
</template>

<script>
import CardboardUsedEditor from "./PosSpecificationEditor/CardboardUsedEditor";
import ProductDetails from "./PosSpecificationEditor/ProductDetails";
import MaterialUsedEditor from "./PosSpecificationEditor/MaterialUsedEditor";
// import DisplayInformation from "./PosSpecificationEditor/DisplayInformation";
import ProductSupportedEditor from "./PosSpecificationEditor/ProductSupportedEditor";
import AdditionalInfo from "./PosSpecificationEditor/AdditionalInfo";

const HAS_PEGBOARD_OPTIONS = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];

const POS_TYPE_OPTIONS = [
  {
    label: "Floor Sticker",
    value: "Floor Sticker",
  },
  {
    label: "Leaflet Holder",
    value: "Leaflet Holder",
  },
  {
    label: "Bollard Cover",
    value: "Bollard Cover",
  },
  {
    label: "FSDU",
    value: "FSDU",
  },
  {
    label: "POS Display",
    value: "POS Display",
  },
  {
    label: "Window Sticker",
    value: "Window Sticker",
  },
  {
    label: "Hanging Sign",
    value: "Hanging Sign",
  },
  {
    label: "Shelf Wobbler",
    value: "Shelf Wobbler",
  },
  {
    label: "Counter Display Unit",
    value: "Counter Display Unit",
  },
  {
    label: "Product Dump Bin",
    value: "Product Dump Bin",
  },
];

export default {
  name: "PosSpecificationEditor",
  components: {
    ProductSupportedEditor,
    CardboardUsedEditor,
    ProductDetails,
    MaterialUsedEditor,
    // DisplayInformation,
    AdditionalInfo,
  },
  props: ["orderLocal"],
  data() {
    return {
      posTypeOptions: POS_TYPE_OPTIONS,
      hasPegboardOptions: HAS_PEGBOARD_OPTIONS,
    };
  },
};
</script>

<style scoped></style>
