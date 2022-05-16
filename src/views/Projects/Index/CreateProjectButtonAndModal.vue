<template>
  <div>
    <a-button type="primary" icon="plus" @click.prevent="showModal">Create Project</a-button>

    <a-modal
      title="Create Project"
      :visible="visible"
      :confirm-loading="isSaving"
      ok-text="Create"
      @ok="attemptSave"
      @cancel="handleCancel"
    >
      <a-form layout="vertical" :form="form">
        <a-form-item label="Name">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: 'Please enter a name' }] }]"
            size="large"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";

const _ = require("lodash");
export default {
  name: "CreateProjectButtonAndModal",
  data() {
    return {
      visible: false,
      isSaving: false,
      form: this.$form.createForm(this, { name: "create_project_form" }),
      serverErrors: [],
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    attemptSave() {
      let vm = this;
      vm.isSaving = true;
      this.form.validateFields((err, vals) => {
        if (!err) {
          vm.save(vals);
        } else {
          vm.isSaving = false;
        }
      });
    },
    save(vals) {
      let vm = this;
      vm.isSaving = true;
      vm.serverErrors = [];
      axios
        .post(window.API_BASE + "/projects", {
          name: vals.name,
        })
        .then((r) => {
          vm.$router.push("/projects/" + r.data.id);
        })
        .catch((e) => {
          vm.$message.error("Error creating project");
          vm.isSaving = false;
          let errors;
          if (typeof e.response.data === "object") {
            errors = _.flatten(_.toArray(e.response.data.errors));
          } else {
            errors = ["Something went wrong. Please try again."];
          }
          vm.serverErrors = errors;
        });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
.ant-form-vertical .ant-form-item {
  margin-bottom: 0 !important;
}
</style>
