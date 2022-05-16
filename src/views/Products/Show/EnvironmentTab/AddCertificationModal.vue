<template>
  <a-modal @ok="attemptSaveCertification" title="Add Certification" v-model="showModal" :confirm-loading="isSaving">
    <a-form layout="vertical">
      <a-form-item label="Certification">
        <a-select v-model="form.name" :disabled="isLoadingCertificationOptions" show-search size="large">
          <a-select-option v-for="option in certificationDropdownOptions" :key="option" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const _ = require("lodash");
import axios from "axios";

export default {
  name: "AddCertificationModal",
  props: ["visible", "productId", "isLoadingCertificationOptions", "certificationOptions"],
  data() {
    return {
      isSaving: false,

      form: {
        name: null,
      },
    };
  },
  computed: {
    certificationDropdownOptions() {
      if (this.certificationOptions) {
        return _.map(this.certificationOptions, "name");
      }
      return [];
    },

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
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },

    resetForm() {
      this.form = {
        name: null,
      };
    },

    attemptSaveCertification() {
      let vm = this;
      vm.isSaving = true;

      axios
        .post(window.API_BASE + "/products/" + this.productId + "/esg/certifications", this.form)
        .then(() => {
          vm.isSaving = false;
          vm.resetForm();
          vm.$emit("certification-added");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error saving certification");
        });
    },
  },
};
</script>

<style scoped></style>
