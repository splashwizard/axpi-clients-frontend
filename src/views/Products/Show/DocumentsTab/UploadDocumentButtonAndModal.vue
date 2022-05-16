<template>
  <div>
    <a-button type="primary" @click="showModal">
      <a-icon type="upload" />
      Click to Upload
    </a-button>
    <loading-screen :is-loading="isSaving"></loading-screen>

    <a-modal
      :centered="true"
      :width="700"
      :mask-closable="false"
      title="Upload Document"
      :footer="null"
      v-model="shouldShowModal"
    >
      <!-- Description -->
      <div>
        <a-form-item label="Description">
          <a-input size="large" v-model="description" type="text" />
        </a-form-item>
      </div>
      <!-- / Description -->

      <a-form-item label="Document">
        <a-upload
          :file-list="fileList"
          :disabled="fileList.length"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <a-button>
            <a-icon type="upload" />
            Select File
          </a-button>
        </a-upload>
      </a-form-item>

      <!-- Submit button -->
      <a-button :disabled="!canUpload" type="primary" :loading="uploading" @click="handleUpload">Upload </a-button>
      <!-- / Submit button -->
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "UploadDocumentButtonAndModal",
  props: ["product"],
  data() {
    return {
      shouldShowModal: false,
      fileDescription: "",
      fileList: [],
      isSaving: false,

      description: "",
      uploading: false,
    };
  },
  watch: {
    shouldShowModal(val) {
      if (val === false) {
        this.description = "";
        this.fileList = [];
      }
    },
  },
  computed: {
    uploadUrl() {
      return window.API_BASE + "/products/" + this.product.productCode + "/documents";
    },
    canUpload() {
      return this.description && this.fileList.length;
    },
  },
  methods: {
    ...mapActions("productViewer", {
      loadDocuments: "loadDocuments",
    }),

    showModal() {
      this.shouldShowModal = true;
    },

    closeModal() {
      this.shouldShowModal = false;
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },

    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },

    handleUpload() {
      let vm = this;

      const { fileList } = this;
      const formData = new FormData();
      formData.append("file", fileList[0]);
      formData.append("description", this.description);
      this.uploading = true;

      axios({
        method: "post",
        url: this.uploadUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          vm.uploading = false;
          vm.shouldShowModal = false;
          vm.loadDocuments();
        })
        .catch((e) => {
          console.log(e);
          vm.uploading = false;
          vm.$message.error("Error uploading document");
        });
    },
  },
};
</script>

<style scoped></style>
