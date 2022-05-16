<template>
  <div class="login-page">
    <div class="login-page-inner">
      <div class="login-form-card">
        <img src="/img/axiom-tab-icon.svg" alt="Logo" width="50" />

        <h1>Welcome Back!</h1>
        <svg class="block mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" width="100" height="2" viewBox="0 0 100 2">
          <path fill="#D8E3EC" d="M0 0h100v2H0z"></path>
        </svg>

        <a-form :form="form" class="login-form" @submit="handleSubmit">
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
              v-decorator="['password', { rules: [{ required: true, message: 'Please input your password' }] }]"
              type="password"
              placeholder="Password"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" size="large" html-type="submit" class="login-form-button" :loading="isLoading">
              Log In
            </a-button>
            <a href=""> Forgot password </a>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: "login_form" }),
    };
  },
  computed: {
    ...mapGetters("auth", {
      isLoading: "isLoading",
    }),
  },
  methods: {
    ...mapActions("auth", {
      attemptLogin: "attemptLogin",
    }),

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.attemptLogin({
            email: values.email,
            password: values.password,
            to: this.$route.query.to ? this.$route.query.to : "/",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.login-page {
  background: #eef1f4;
  width: 100%;
  height: 100%;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .login-form-card {
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

    .login-form {
      margin-top: 30px;
    }

    .login-form-button {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
