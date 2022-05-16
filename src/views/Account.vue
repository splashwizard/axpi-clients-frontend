<template>
  <div class="account">
    <div class="page-header">
      <h1 class="page-title">Manage Account</h1>
    </div>

    <a-descriptions :column="1" bordered>
      <a-descriptions-item label="Name">
        {{ user.name }}
      </a-descriptions-item>
      <a-descriptions-item label="Email">
        <span class="margin-right">{{ user.email }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="Actions">
        <a-button type="primary" @click="openChangeEmailModal" class="margin-right">Change Email</a-button>
        <a-modal v-model="changeEmailModalVisible" title="Change Email" :footer="null">
          <change-email-form @email-changed="closeChangeEmailModal"></change-email-form>
        </a-modal>

        <a-button type="primary" @click="openChangePasswordModal">Change Password</a-button>
        <a-modal v-model="changePasswordModalVisible" title="Change Password" :footer="null">
          <change-password-form @password-changed="closeChangePasswordModal"></change-password-form>
        </a-modal>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script>
import ChangePasswordForm from "../components/Account/ChangePasswordForm";
import ChangeEmailForm from "../components/Account/ChangeEmailForm";
import { mapGetters } from "vuex";

export default {
  components: { ChangePasswordForm, ChangeEmailForm },

  data() {
    return {
      changePasswordModalVisible: false,
      changeEmailModalVisible: false,
    };
  },

  computed: {
    ...mapGetters("auth", {
      user: "user",
    }),
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
    },
  },
};
</script>
<style scoped>
.account-card {
  margin-top: 20px;
}

.margin-right {
  margin-right: 15px;
}
</style>
