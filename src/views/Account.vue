<template>
  <div class="account">
    <div class="page-header">
      <h1 class="page-title">Manage Account</h1>
    </div>

    <!-- Reset Password -->
    <div class="account-card">
      <a-button type="primary" @click="openChangePasswordModal">Change Password</a-button>
      <a-modal v-model="changePasswordModalVisible" title="Change Password" :footer="null">
        <change-password-form @password-changed="closeChangePasswordModal"></change-password-form>
      </a-modal>
    </div>
    <!-- / Reset Password -->

    <!-- Reset Email -->
    <div class="account-card">
      <a-button type="primary" @click="openChangeEmailModal">Change Email</a-button>
      <a-modal v-model="changeEmailModalVisible" title="Change Email" :footer="null">
        <change-email-form @email-changed="closeChangeEmailModal"></change-email-form>
      </a-modal>
    </div>
    <!-- / Reset Email -->
  </div>
</template>
<script>
import ChangePasswordForm from "../components/Account/ChangePasswordForm";
import ChangeEmailForm from "../components/Account/ChangeEmailForm";

export default {
  components: {ChangePasswordForm, ChangeEmailForm},

  data() {
    return {
      changePasswordModalVisible: false,
      changeEmailModalVisible: false
    }
  },

  methods: {
    openChangePasswordModal() {
      this.changePasswordModalVisible = true;
    },

    closeChangePasswordModal() {
      this.changePasswordModalVisible = false;
    },

    openChangeEmailModal() {
      this.changeEmailModalVisible = true;
    },

    closeChangeEmailModal() {
      this.changeEmailModalVisible = false;
    }
  }
}
</script>
<style scoped>
.account-card {
  margin-top: 20px;
}
</style>