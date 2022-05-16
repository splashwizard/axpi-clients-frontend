<template>
  <div style="padding-top: 15px">
    <table class="axpi-basic-table">
      <thead>
        <tr>
          <th>Document</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(document, i) in documents" :key="i">
          <td>
            {{ document.description }}
          </td>
          <td style="text-align: right">
            <!--          <a style="margin-right: 5px" :href="getDownloadLink(document.url)" target="_blank">Download</a>-->
            <a-button
              @click.prevent="download(document.url)"
              icon="download"
              size="small"
              style="margin-right: 5px"
            ></a-button>
            <delete-document-button :product="product" :document="document"></delete-document-button>
          </td>
        </tr>
        <tr v-if="documents.length === 0">
          <td colspan="2">No documents</td>
        </tr>
      </tbody>
    </table>

    <div class="upload-button-wrapper" v-if="view === 'edit'">
      <!--      <a-upload-->
      <!--          :showUploadList="false"-->
      <!--          name="file"-->
      <!--          :multiple="true"-->
      <!--          :action="uploadUrl"-->
      <!--          :headers="headers"-->
      <!--          @change="handleChange"-->
      <!--      >-->
      <!--        <a-button type="primary">-->
      <!--          <a-icon type="upload"/>-->
      <!--          Click to Upload-->
      <!--        </a-button>-->
      <!--      </a-upload>-->

      <!-- Upload document button and modal -->
      <upload-document-button-and-modal :product="product"></upload-document-button-and-modal>
      <!-- / Upload document button and modal -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import store from "../../../store";
import DeleteDocumentButton from "./DocumentsTab/DeleteDocumentButton";
import UploadDocumentButtonAndModal from "./DocumentsTab/UploadDocumentButtonAndModal";

export default {
  name: "DocumentsTab",
  components: { UploadDocumentButtonAndModal, DeleteDocumentButton },
  computed: {
    ...mapGetters("productViewer", {
      product: "product",
      documents: "documents",
      view: "view",
    }),
    ...mapGetters("auth", {
      apiToken: "apiToken",
    }),
    headers() {
      let headers = {};
      const token = store.getters["auth/apiToken"];
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }
      return headers;
    },
    uploadUrl() {
      return window.API_BASE + "/products/" + this.product.productCode + "/documents";
    },
  },
  methods: {
    ...mapActions("productViewer", {
      loadDocuments: "loadDocuments",
    }),

    handleChange(info) {
      if (info.file.status === "done") {
        this.$message.success("Upload successful");
        this.loadDocuments();
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },

    getDownloadLink(src) {
      return window.IMAGE_STORAGE_BASE + "/" + src;
    },

    download(src) {
      window.open(this.getDownloadLink(src), "_blank");
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.upload-button-wrapper {
  margin-top: 35px;
}

.ant-popover-inner-content {
}
</style>
