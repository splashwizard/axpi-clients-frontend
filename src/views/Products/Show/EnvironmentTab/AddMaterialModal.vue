<template>
  <a-modal @ok="attemptSaveMaterial" title="Add Material" v-model="showModal" :confirm-loading="isSaving">
    <a-form layout="vertical">
      <a-form-item label="Aspect">
        <a-select v-model="form.aspect" :disabled="isLoadingAspectOptions" show-search size="large">
          <a-select-option v-for="option in aspectDropdownOptions" :key="option" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Material">
        <a-select v-model="form.material" :disabled="isLoadingMaterialOptions" show-search size="large">
          <a-select-option v-for="option in materialDropdownOptions" :key="option" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Weight">
        <a-input-group style="width: 100%" compact>
          <a-input size="large" v-model="form.weight" style="width: calc(100% - 150px)" />
          <a-select size="large" style="width: 150px" v-model="form.weight_unit">
            <a-select-option value="kg"> kg </a-select-option>
            <a-select-option value="lb"> lb </a-select-option>
          </a-select>
        </a-input-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import axios from "axios";

const _ = require("lodash");
export default {
  name: "AddMaterialModal",
  props: [
    "visible",
    "productId",
    "isLoadingMaterialOptions",
    "materialOptions",
    "isLoadingAspectOptions",
    "aspectOptions",
  ],
  data() {
    return {
      isSaving: false,

      form: {
        aspect: null,
        material: null,
        weight: null,
        weight_unit: "kg",
      },
    };
  },
  computed: {
    showModal: {
      get() {
        return this.visible;
      },
      set(val) {
        if (!val) {
          this.closeModal();
        }
      },
    },

    materialDropdownOptions() {
      if (this.materialOptions) {
        return _.map(this.materialOptions, "name");
      }
      return [];
    },

    aspectDropdownOptions() {
      if (this.aspectOptions) {
        return _.map(this.aspectOptions, "name");
      }
      return [];
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },

    resetForm() {
      this.form = {
        aspect: null,
        material: null,
        weight: null,
        weight_unit: "kg",
      };
    },

    attemptSaveMaterial() {
      let vm = this;
      vm.isSaving = true;

      axios
        .post(window.API_BASE + "/products/" + this.productId + "/esg/materials", this.form)
        .then(() => {
          vm.isSaving = false;
          vm.resetForm();
          vm.$emit("material-added");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error saving material");
        });
    },
  },
};
</script>

<style scoped></style>
