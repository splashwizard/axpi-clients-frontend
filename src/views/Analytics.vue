<template>
  <div class="analytics-new">
    <loading-screen :is-loading="isLoading"></loading-screen>
        <div id="embedding-container"></div>

<!--    <iframe-->
<!--        class="quicksight-iframe"-->
<!--        src="https://eu-west-2.quicksight.aws.amazon.com/sn/embed/share/accounts/461953326420/dashboards/aecd70ca-668f-4fa8-997e-ffd13e3feefa">-->
<!--    </iframe>-->
  </div>
</template>
<script>
import axios from 'axios';
import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

export default {
  components: {},

  data() {
    return {
      isLoading: false,
      embedUrl: null
    }
  },

  computed: {},

  created() {
    this.getEmbedUrlAndSetup();
    // this.setup();
  },

  methods: {
    getEmbedUrlAndSetup() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/quicksight').then(r => {
        vm.isLoading = false;
        this.embedUrl = r.data;
        this.setup();
        console.log(r.data);
      }).catch(e => {
        console.log(e);
        this.isLoading = false;
        this.$message.error('Error loading analytics');
      });
    },

    setup() {
      var options = {
        url: this.embedUrl,
        container: document.getElementById("embedding-container"),
        // parameters: {
        //   country: "United States",
        //   states: [
        //     "California",
        //     "Washington"
        //   ]
        // },
        scrolling: "no",
        height: "100%",
        iframeResizeOnSheetChange: false, // use this option in combination with height: AutoFit, to allow iframe height to resize dynamically, based on sheet height, on changing sheets.
        width: "100%",
        locale: "en-US",
        footerPaddingEnabled: true,
        // sheetId: 'YOUR_SHEETID' // use this option to specify initial sheet id to load for the embedded dashboard
        sheetTabsDisabled: false, // use this option to enable or disable sheet tab controls in dashboard embedding
        printEnabled: false, // use this option to enable or disable print option for dashboard embedding
        undoRedoDisabled: false, // set this option to true to disable undo and redo buttons for dashboard embedding
        resetDisabled: false, // set this option to true to disable reset button for dashboard embedding
        // defaultEmbeddingVisualType: TABLE // this option only applies to experience embedding and will not be used for dashboard embedding
      };

      QuickSightEmbedding.embedDashboard(options);
    }
  }
}
</script>
<style scoped lang="scss">
.analytics-new {
  height: 100%;
  width: 100%;
  display: flex;

  #embedding-container {
    border: 0 !important;
    flex-grow: 1;
    width: 100%;
    height: 100%;

    .quicksight-embedding-iframe {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>