<template>
  <div class="wrapper">
    <a-button icon="export" type="primary" @click="showShareModal">Export</a-button>
    <!--    <a-button icon="share-alt" @click="showShareModal">Share</a-button>-->

    <a-modal title="Export Scenario" :visible="shareModalVisible" @cancel="handleShareCancel" :footer="false">
      <a-row :gutter="10" class="options-selector">
        <a-col :span="8">
          <a-button block>
            <a-icon type="export" style="font-size: 40px; color: #e1e1e1"></a-icon>
            <div class="caption">SAP Ariba</div>
          </a-button>
        </a-col>
        <a-col :span="8">
          <a-button block>
            <a-icon type="file-excel" style="font-size: 40px; color: #e1e1e1"></a-icon>
            <div class="caption">Excel</div>
          </a-button>
        </a-col>
        <a-col :span="8">
          <a-button block>
            <a-icon type="file-pdf" style="font-size: 40px; color: #e1e1e1"></a-icon>
            <div class="caption">PDF</div>
          </a-button>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "ReviewExportButtonAndModal",
  data() {
    return {
      shareModalVisible: false,
    };
  },
  methods: {
    showShareModal() {
      this.shareModalVisible = true;
    },

    handleShareCancel() {
      this.shareModalVisible = false;
    },

    selectMethod(method) {
      alert(method);
      this.shareModalVisible = false;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: inline;
}

.method-selector {
  margin-bottom: 15px;
}

.icon-selector a {
  flex: 1;
}

.icon-selector .icon {
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
}

.icon-selector .caption {
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.icon-selector a:hover .icon {
  background: #5d9cf4 !important;
}

.options-selector .ant-btn {
  height: 130px;
}

.options-selector .ant-btn i {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.options-selector .ant-btn:hover i {
  color: #40a9ff !important;
}

.options-selector .caption {
  /*font-weight: bold;*/
  margin-top: 15px;
}
</style>
