<template>
  <a-form layout="vertical">
    <errors :error-list="serverErrors"></errors>

    <loading-screen :is-loading="isSaving"></loading-screen>
    <a-form-item label="Current Email">
      <a-input size="large" v-model="currentEmail" type="text" />
    </a-form-item>
    <a-form-item label="New Email">
      <a-input size="large" v-model="newEmail" type="text" />
    </a-form-item>
    <a-form-item label="Confirm New Email">
      <a-input size="large" v-model="newEmailConfirmation" type="text" />
    </a-form-item>
    <a-button type="primary" size="large" @click="resetEmail">Change Email</a-button>
  </a-form>
</template>

<script>
import axios from "axios";
import Forms from "../../mixins/Forms";
import Errors from "../Errors";

export default {
  name: "ChangeEmailForm",
  mixins: [Forms],

  components: { Errors },

  data() {
    return {
      currentEmail: "",
      newEmail: "",
      newEmailConfirmation: "",

      isSaving: false,
      serverErrors: [],
    };
  },

  methods: {
    validateForm() {
      if (!this.currentEmail) {
        this.$message.error("Please enter your current email");
        return false;
      }

      if (!this.newEmail) {
        this.$message.error("Please enter a new email");
        return false;
      }

      if (!this.newEmailConfirmation) {
        this.$message.error("Please confirm your new email");
        return false;
      }

      if (this.newEmail !== this.newEmailConfirmation) {
        this.$message.error("New email and email confirmation don't match");
        return false;
      }

      return true;
    },

    resetEmail() {
      let vm = this;
      vm.serverErrors = [];

      if (vm.validateForm() === false) {
        return false;
      }

      axios
        .post(window.API_COMMON_BASE + "/account/change-email", {
          current_email: vm.currentEmail,
          new_email: vm.newEmail,
          new_email_confirmation: vm.newEmailConfirmation,
        })
        .then(() => {
          vm.isSaving = false;
          this.$message.success("Email changed successfully!");
          this.newEmail = "";
          this.newEmailConfirmation = "";
          this.currentEmail = "";
          this.$emit("email-changed");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.setErrors(e);
        });

      vm.isSaving = true;
    },
  },
};
</script>

<style scoped></style>
