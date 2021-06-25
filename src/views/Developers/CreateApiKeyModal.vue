<template>
  <div>
    <a-button icon="plus" type="primary" @click="showModal">
      Create API Key
    </a-button>
    <a-modal
        title="Create API Token"
        :visible="visible"
        :confirm-loading="isSaving"
        @ok="handleOk"
        @cancel="handleCancel"
    >
      <div class="create-api-key-modal-inner">
        <a-form layout="vertical">
          <a-form-item label="Token Name">
            <a-input v-model="name" size="large" :value="name"/>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      visible: false,
      isSaving: false,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {
      if (this.name.length === 0) {
        this.$message.info('Please provide a token name');
        return false;
      }

      this.isSaving = true;
      axios.post(window.API_COMMON_BASE + '/developers/tokens', {
        name: this.name
      }).then(() => {
        this.isSaving = false;
        this.$message.success('API key created successfully');
        this.$emit('api-key-created');
        this.visible = false;
        this.name = '';
      }).catch(e => {
        console.log(e);
        this.$message.error('An error occurred while creating API token');
        this.isSaving = false;
      });
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.name = '';
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