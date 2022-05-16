<template>
  <div class="dispatches-from-wrapper">
    <a-spin size="small" v-if="isLoading"></a-spin>
    <a-tag color="red" v-if="!isLoading && dispatchesFrom == 'Unknown'"> Unknown </a-tag>
    <span v-if="!isLoading && dispatchesFrom !== 'Unknown'">
      {{ dispatchesFrom }}
    </span>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DispatchesFrom",
  props: ["product"],
  created() {
    this.fetch();
  },
  watch: {
    product() {
      this.fetch();
    },
  },
  data() {
    return {
      isLoading: false,
      dispatchesFrom: "",
    };
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/products/" + this.product["_id"] + "/dispatches-from")
        .then((r) => {
          vm.dispatchesFrom = r.data;
          vm.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading dispatches from");
        });
    },
  },
};
</script>

<style scoped>
.dispatches-from-wrapper {
  display: inline-block;
}
</style>
