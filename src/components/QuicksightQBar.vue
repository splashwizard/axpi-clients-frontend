<template>
  <div class="quicksight-q-bar-wrapper">
    <!--    <a-spin v-if="isLoading"></a-spin>-->
    <div id="q-bar-embedding-container"></div>
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
        .get(window.API_BASE + "/quicksight-q-bar")
        .then((r) => {
          vm.isLoading = false;
          this.embedUrl = r.data;
          this.setup();
          console.log(r.data);
        })
        .catch((e) => {
          console.log(e);
          this.isLoading = false;
        });
    },

    setup() {
      var containerDiv = document.getElementById("q-bar-embedding-container");
      var options = {
        url: this.embedUrl,
        container: containerDiv,
        width: "100%",
        qSearchBarOptions: {
          // expandCallback: onOpen,
          // collapseCallback: onClose,
          iconDisabled: false,
          topicNameDisabled: false,
          // themeId: 'theme12345',
          allowTopicSelection: true,
        },
      };
      QuickSightEmbedding.embedQSearchBar(options);
    },
  },
};
</script>
<style scoped lang="scss">
.quicksight-q-bar-wrapper {
  width: 100%;
  flex: 1;
  display: flex;

  #q-bar-embedding-container {
    //padding-top: 8px;
    border: 0 !important;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    padding-top: 9px !important;

    .quicksight-embedding-iframe {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
