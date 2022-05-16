<template>
  <div class="reset-password-page">
    <div class="reset-password-page-inner">
      <div class="reset-password-form-card">
        <img src="/img/axiom-tab-icon.svg" alt="Logo" width="50" />

        <h1>Reset your password</h1>
        <svg class="block mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" width="100" height="2" viewBox="0 0 100 2">
          <path fill="#D8E3EC" d="M0 0h100v2H0z"></path>
        </svg>

        <errors :error-list="serverErrors"></errors>

        <a-form :form="form" class="reset-password-form" @submit="handleSubmit">
          <a-form-item>
            <a-input
              size="large"
              v-decorator="[
                'email',
                {
                  rules: [
                    { required: true, message: 'Please input your email' },
                    { type: 'email', message: 'Please enter a valid email address' },
                  ],
                },
              ]"
              placeholder="Email"
            >
              <a-icon slot="prefix" type="mail" style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              v-decorator="['password', { rules: [{ required: true, message: 'Please input your new password' }] }]"
              placeholder="New Password"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              size="large"
              html-type="submit"
              class="reset-password-form-button"
              :loading="isSaving"
            >
              Change Password
            </a-button>
            <a href="/login"> Login </a>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Forms from "../mixins/Forms";
import Errors from "../components/Errors";

export default {
  name: "Home",
  components: { Errors },
  mixins: [Forms],
  data() {
    return {
      form: this.$form.createForm(this, { name: "reset_password_form" }),
      isSaving: false,
      serverErrors: [],
    };
  },
  methods: {
    handleSubmit(e) {
      let vm = this;
      this.serverErrors = [];
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          vm.isSaving = true;
          let email = values.email;
          let password = values.password;

          axios
            .post(window.API_COMMON_BASE + "/account/reset-password", {
              email: email,
              token: vm.$route.query.token,
              password: password,
            })
            .then(() => {
              vm.isSaving = false;
              vm.$message.success("Password reset successfully");
              vm.$router.push("/login");
            })
            .catch((e) => {
              console.log(e);
              vm.isSaving = false;
              vm.setErrors(e);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.reset-password-page {
  background: #eef1f4;
  width: 100%;
  height: 100%;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .reset-password-form-card {
    margin-top: 25px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 5%);
    max-width: 25rem;
    width: 25rem;
    padding: 2rem 2rem 0.4rem 2rem;
    background: #fff;
    border-radius: 0.5rem;

    img {
      margin-bottom: 20px;
    }

    .reset-password-form {
      margin-top: 30px;
    }

    .reset-password-form-button {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
