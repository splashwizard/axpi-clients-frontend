<template>
  <div>
    <a-list v-if="documents.length" item-layout="horizontal" :data-source="documents">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta>
          <div slot="title">{{ item.description }}</div>
        </a-list-item-meta>
        <a slot="actions" :href="getDownloadLink(item.url)" target="_blank">Download</a>
        <delete-document-button></delete-document-button>
      </a-list-item>
    </a-list>

    <div class="upload-button-wrapper">
      <a-upload
          :showUploadList="false"
          name="file"
          :multiple="true"
          :action="uploadUrl"
          :headers="headers"
          @change="handleChange"
      >
        <a-button>
          <a-icon type="upload"/>
          Click to Upload
        </a-button>
      </a-upload>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import store from "../../../store";

export default {
  name: "DocumentsTab",
  computed: {
    ...mapGetters('productViewer', {
      product: 'product',
      documents: 'documents'
    }),
    ...mapGetters('auth', {
      apiToken: 'apiToken'
    }),
    headers() {
      let headers = {};
      const token = store.getters['auth/apiToken'];
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }
      return headers;
    },
    uploadUrl() {
      return window.API_BASE + '/products/' + this.product.productCode + '/documents';
    }
  },
  methods: {
    ...mapActions('productViewer', {
      loadDocuments: 'loadDocuments'
    }),

    handleChange(info) {
      if (info.file.status === 'done') {
        this.$message.success('Upload successful');
        this.loadDocuments();
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },

    getDownloadLink(src) {
      return window.IMAGE_STORAGE_BASE + '/' + src;
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.upload-button-wrapper {
  margin-top: 15px;
}

.ant-popover-inner-content {
}
</style>