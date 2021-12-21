<template>
  <div class="analytics-new">
<!--    <div class="embedding-container"></div>-->

    <iframe
        class="quicksight-iframe"
        src="https://eu-west-2.quicksight.aws.amazon.com/sn/embed/share/accounts/461953326420/dashboards/aecd70ca-668f-4fa8-997e-ffd13e3feefa">
    </iframe>
  </div>
</template>
<script>
// import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

export default {
  components: {},

  data() {
    return {}
  },

  computed: {},

  created() {
    // this.setup();
  },

  methods: {
    // setup() {
    //   var options = {
    //     url: "https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/dashboardId?isauthcode=true&identityprovider=quicksight&code=authcode",
    //     container: document.getElementById("embedding-container"),
    //     // parameters: {
    //     //   country: "United States",
    //     //   states: [
    //     //     "California",
    //     //     "Washington"
    //     //   ]
    //     // },
    //     scrolling: "no",
    //     height: "700px",
    //     iframeResizeOnSheetChange: false, // use this option in combination with height: AutoFit, to allow iframe height to resize dynamically, based on sheet height, on changing sheets.
    //     width: "1000px",
    //     locale: "en-US",
    //     footerPaddingEnabled: true,
    //     // sheetId: 'YOUR_SHEETID' // use this option to specify initial sheet id to load for the embedded dashboard
    //     sheetTabsDisabled: false, // use this option to enable or disable sheet tab controls in dashboard embedding
    //     printEnabled: false, // use this option to enable or disable print option for dashboard embedding
    //     undoRedoDisabled: false, // set this option to true to disable undo and redo buttons for dashboard embedding
    //     resetDisabled: false, // set this option to true to disable reset button for dashboard embedding
    //     // defaultEmbeddingVisualType: TABLE // this option only applies to experience embedding and will not be used for dashboard embedding
    //   };
    //
    //   const dashboard = QuickSightEmbedding.embedDashboard(options);
    // }
  }
}
</script>
<style scoped lang="scss">
.analytics-new {
  height: 100%;
  width: 100%;
  display: flex;

  .quicksight-iframe {
    border: 0 !important;
    flex-grow: 1;
    width: 100%;
    height: 100%;
  }
}
</style>