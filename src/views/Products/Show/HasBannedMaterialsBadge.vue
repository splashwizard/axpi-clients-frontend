<template>
  <a-tag color="#000" :class="{ hidden: !hasBannedMaterials }"> Has Banned Materials </a-tag>
</template>

<script>
import axios from "axios";
import eventBus from "../../../event-bus";
export default {
  props: ["productId"],
  name: "HasBannedMaterialsBadge",
  data() {
    return {
      isLoading: false,
      hasBannedMaterials: false,
    };
  },
  watch: {
    productId() {
      this.determineIfHasBannedMaterials();
    },
  },
  created() {
    this.determineIfHasBannedMaterials();
    let vm = this;
    eventBus.$on("product-materials-updated", function () {
      vm.determineIfHasBannedMaterials();
    });
  },
  methods: {
    determineIfHasBannedMaterials() {
      let vm = this;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/products/" + this.productId + "/esg/has-banned-materials")
        .then((r) => {
          vm.isLoading = false;
          vm.hasBannedMaterials = Boolean(r.data);
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
