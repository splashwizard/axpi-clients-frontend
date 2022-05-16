<template>
  <a-steps :current="wizardStage" size="small" @change="setWizardStage">
    <a-step title="General Information" />
    <a-step title="Specification Information" />
    <a-step title="Additional Information" />
  </a-steps>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProgressBar",
  props: ["section"],
  computed: {
    ...mapGetters("orderEditor", {
      wizardStage: "wizardStage",
    }),
  },
  methods: {
    ...mapActions("orderEditor", {
      setWizardStage: "setWizardStage",
    }),
  },
};
</script>

<style scoped></style>
