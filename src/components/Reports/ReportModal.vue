<template>
  <div class="report-modal">
    <a-modal v-model="shouldShowModal" title="Basic Modal" width="100%" :footer="null" :centered="true">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "ReportModal",
  props: ["visible", "idOfReportToShow"],
  computed: {
    shouldShowModal: {
      set(value) {
        if (value === false) {
          this.$emit("modal-closed");
        }
      },
      get() {
        return this.visible;
      },
    },
  },
};
</script>

<style lang="scss"></style>
