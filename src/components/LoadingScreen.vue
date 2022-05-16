<template>
  <loading :active.sync="isLoading" :can-cancel="false" :z-index="99999" :is-full-page="true"> </loading>
</template>
<style scoped></style>
<script>
// Import component
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  props: ["isLoading"],
  components: {
    Loading,
  },
};
</script>
