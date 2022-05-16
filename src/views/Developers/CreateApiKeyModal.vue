<template>
  <div>
    <a-button icon="plus" type="primary" @click="showModal"> Create API Key </a-button>
    <a-modal
      title="Create API Token"
      :visible="visible"
      :confirm-loading="isSaving"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="create-api-key-modal-inner">
        <a-form layout="vertical" v-if="!token">
          <a-form-item label="Token Name">
            <a-input v-model="name" size="large" :value="name" />
          </a-form-item>
        </a-form>
        <div v-if="token">
          <p>Your API token is:</p>
          <p>
            <b>
              {{ token.plainTextToken }}
            </b>
          </p>
          <p>Please copy this token now as you will not be able to see it again.</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      visible: false,
      isSaving: false,
      token: null,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
      this.token = null;
    },
    handleOk() {
      if (this.token) {
        this.token = null;
        this.visible = false;
        return false;
      }

      if (this.name.length === 0) {
        this.$message.info("Please provide a token name");
        return false;
      }

      this.isSaving = true;
      axios
        .post(window.API_COMMON_BASE + "/developers/tokens", {
          name: this.name,
        })
        .then((r) => {
          this.isSaving = false;
          this.$message.success("API key created successfully");
          this.$emit("api-key-created");
          this.name = "";
          this.token = r.data;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("An error occurred while creating API token");
          this.isSaving = false;
        });
    },
    handleCancel() {
      this.name = "";
      this.visible = false;
    },
  },
};
</script>
<style lang="scss">
.create-api-key-modal-inner {
  .ant-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
