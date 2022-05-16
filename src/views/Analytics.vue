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
import axios from "axios";
import * as QuickSightEmbedding from "amazon-quicksight-embedding-sdk";

export default {
  components: {},

  data() {
    return {
      isLoading: false,
      embedUrl: null,
    };
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
      axios
        .get(window.API_BASE + "/quicksight")
        .then((r) => {
          vm.isLoading = false;
          this.embedUrl = r.data;
          this.setup();
          console.log(r.data);
        })
        .catch((e) => {
          console.log(e);
          this.isLoading = false;
          this.$message.error("Error loading analytics");
        });
    },

    setup() {
      var containerDiv = document.getElementById("embedding-container");
      var options = {
        url: this.embedUrl,
        container: containerDiv,
        // parameters: {
        //   country: "United States"
        // },
        scrolling: "no",
        height: "100%",
        width: "100%",
        locale: "en-US",
        footerPaddingEnabled: true,
        defaultEmbeddingVisualType: "TABLE", // this option only applies to QuickSight console embedding and is not used for dashboard embedding
      };
      QuickSightEmbedding.embedSession(options);
    },
  },
};
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
