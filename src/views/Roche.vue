<template>
  <div :class="{ 'roche-page': !authenticated }">
    <div class="login-page-inner" v-if="!authenticated">
      <div class="login-form-card">
        <img src="/img/axiom-tab-icon.svg" alt="Logo" width="50" />

        <h1>Roche POC Report</h1>
        <svg class="block mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" width="100" height="2" viewBox="0 0 100 2">
          <path fill="#D8E3EC" d="M0 0h100v2H0z"></path>
        </svg>

        <a-form :form="form" class="login-form" @submit="handleSubmit">
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
              Enter
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <iframe
      v-if="authenticated"
      src="https://flo.uri.sh/story/898435/embed"
      title="Interactive or visual content"
      frameborder="0"
      scrolling="no"
      style="width: 100%; height: 600px"
      sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
    ></iframe>
    <div style="width: 100%!; margin-top: 4px !important; text-align: right !important"></div>
  </div>
</template>

<script>
export default {
  name: "Roche",
  data() {
    return {
      form: this.$form.createForm(this, { name: "roche_login_form" }),
      authenticated: false,
      isLoading: false,
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.password == "RocheProofOfConcept2021") {
            this.$message.success("Welcome!");
            this.authenticated = true;
          } else {
            this.$message.error("Incorrect password");
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.roche-page {
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
