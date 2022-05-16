<template>
  <div class="invite-supplier-wrapper">
    <a-button type="primary" icon="plus" @click.prevent="openModal">Invite Supplier</a-button>
    <a-modal v-model="showModal" title="Invite Supplier" :footer="null">
      <errors :error-list="serverErrors"></errors>

      <a-form :form="form" class="invite-supplier-form" @submit="handleSubmit" layout="vertical">
        <a-form-item label="Company Name">
          <a-input
            v-decorator="['company_name', { rules: [{ required: true, message: 'Please enter a company name' }] }]"
            size="large"
          />
        </a-form-item>
        <a-form-item label="Name">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: 'Please enter a name' }] }]"
            size="large"
          />
        </a-form-item>
        <a-form-item label="Email">
          <a-input
            v-decorator="[
              'email',
              {
                rules: [
                  { required: true, message: 'Please enter an email' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ],
              },
            ]"
            size="large"
          />
        </a-form-item>
        <a-button
          type="primary"
          size="large"
          html-type="submit"
          class="invite-supplier-form-button"
          :loading="isSaving"
        >
          Invite Supplier
        </a-button>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Errors from "../Errors";
import axios from "axios";
import Forms from "../../mixins/Forms";

export default {
  name: "InviteSuppliersButtonAndModal",
  data() {
    return {
      showModal: false,
      form: this.$form.createForm(this, { name: "invite_supplier_form" }),
      isSaving: false,
      serverErrors: [],
    };
  },
  mixins: [Forms],
  components: { Errors },
  methods: {
    openModal() {
      this.showModal = true;
    },
    handleSubmit(e) {
      e.preventDefault();

      let vm = this;
      vm.serverErrors = [];

      vm.form.validateFields((err, values) => {
        if (!err) {
          vm.isSaving = true;
          let companyName = values.company_name;
          let name = values.name;
          let email = values.email;

          axios
            .post(window.API_BASE + "/suppliers/invite", {
              company_name: companyName,
              name: name,
              email: email,
            })
            .then(() => {
              vm.isSaving = false;
              vm.form.resetFields();
              vm.showModal = false;
              vm.$message.success("Invite sent successfully!");
            })
            .catch((e) => {
              console.log(e);
              vm.setErrors(e);
              vm.isSaving = false;
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.invite-supplier-wrapper {
  display: inline;
}
</style>
