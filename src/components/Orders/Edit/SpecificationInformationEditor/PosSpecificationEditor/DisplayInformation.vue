<template>
  <a-row :gutter="70">
    <a-col :span="12">
      <a-form layout="vertical">
        <a-form-item label="Weight Supported">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_weight_supported" />
            <a-select default-value="g" style="width: 25%" size="large" v-model="orderLocal.pos_weight_support_unit">
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

        <a-form-item label="Width">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_display_width" />
            <a-select default-value="GBP" style="width: 25%" size="large" v-model="orderLocal.pos_display_width_unit">
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Depth">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_display_depth" />
            <a-select default-value="cm" size="large" style="width: 25%" v-model="orderLocal.pos_display_depth_unit">
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Height">
          <a-input-group compact>
            <a-input size="large" style="width: 75%" v-model="orderLocal.pos_display_height" />
            <a-select default-value="cm" style="width: 25%" size="large" v-model="orderLocal.pos_display_height_unit">
              <a-select-option value="cm"> cm </a-select-option>
              <a-select-option value="inch"> inch </a-select-option>
            </a-select>
          </a-input-group>
        </a-form-item>

        <a-form-item label="Has Pegboard?">
          <a-radio-group @change="forceRefresh" v-model="orderLocal.has_pegboard" button-style="solid">
            <a-radio-button v-for="option in hasPegboardOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: "DisplayInformation",
  props: ["orderLocal"],
  data() {
    return {
      hasPegboardOptions: HAS_PEGBOARD_OPTIONS,
    };
  },
  methods: {
    forceRefresh() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
  },
};
</script>

<style scoped></style>
