<template>
  <div class="wrapper">
    <a-button v-if="!isLoading" size="sm" style="margin-left: 20px" @click.prevent="openModal"
      >View Breakdown
    </a-button>

    <a-modal class="fullscreen-modal" :centered="true" v-model="modalVisible" title="Emission Breakdown" :footer="null">
      <emission-breakdown-graph v-if="!isLoading && emissions" :emissions="emissions"></emission-breakdown-graph>
    </a-modal>
  </div>
</template>

<script>
import EmissionBreakdownGraph from "./EmissionBreakdownGraph";

export default {
  name: "EmissionBreakdownModal",
  props: ["isLoading", "emissions"],
  components: { EmissionBreakdownGraph },
  data() {
    return {
      modalVisible: false,
    };
  },
  methods: {
    openModal() {
      this.modalVisible = true;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: inline !important;
}
</style>
