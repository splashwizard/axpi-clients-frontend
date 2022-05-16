<template>
  <a-form layout="vertical">
    <errors :error-list="serverErrors"></errors>

    <loading-screen :is-loading="isSaving"></loading-screen>
    <a-form-item label="Current Password">
      <a-input size="large" v-model="currentPassword" type="password" />
    </a-form-item>
    <a-form-item label="New Password">
      <a-input size="large" v-model="newPassword" type="password" />
    </a-form-item>
    <a-form-item label="Confirm New Password">
      <a-input size="large" v-model="newPasswordConfirmation" type="password" />
    </a-form-item>
    <a-button type="primary" size="large" @click="resetPassword">Reset Password</a-button>
  </a-form>
</template>

<script>
import axios from "axios";
import Forms from "../../mixins/Forms";
import Errors from "../Errors";

export default {
  name: "ChangePasswordForm",
  mixins: [Forms],

  components: { Errors },

  data() {
    return {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",

      isSaving: false,
      serverErrors: [],
    };
  },

  methods: {
    validateForm() {
      if (!this.currentPassword) {
        this.$message.error("Please enter your current password");
        return false;
      }

      if (!this.newPassword) {
        this.$message.error("Please enter a new password");
        return false;
      }

      if (!this.newPasswordConfirmation) {
        this.$message.error("Please confirm your new password");
        return false;
      }

      if (this.newPassword !== this.newPasswordConfirmation) {
        this.$message.error("New password and password confirmation don't match");
        return false;
      }

      return true;
    },

    resetPassword() {
      let vm = this;
      vm.serverErrors = [];

      if (vm.validateForm() === false) {
        return false;
      }

      axios
        .post(window.API_COMMON_BASE + "/account/change-password", {
          current_password: vm.currentPassword,
          new_password: vm.newPassword,
          new_password_confirmation: vm.newPasswordConfirmation,
        })
        .then(() => {
          vm.isSaving = false;
          this.$message.success("Password changed successfully!");
          this.newPassword = "";
          this.newPasswordConfirmation = "";
          this.currentPassword = "";
          this.$emit("password-changed");
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
