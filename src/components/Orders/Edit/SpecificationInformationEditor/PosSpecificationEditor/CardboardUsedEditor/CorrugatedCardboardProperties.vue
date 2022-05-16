<template>
  <div>
    <div class="ant-col ant-form-item-label"><label title="Type of Cardboard" class="">Number Of Walls</label></div>
    <number-of-walls-selector
      :cardboard="cardboard"
      @property-updated="handlePropertyUpdated"
    ></number-of-walls-selector>

    <!-- Wall Details -->
    <div class="wall-details" :key="updateKey">
      <!-- Single Face -->
      <template v-if="this.cardboard.number_of_walls === 'single-face'">
        <wall-details :cardboard="cardboard" :wall="1" :is-last-wall="false"></wall-details>
      </template>
      <!-- / Single Face -->

      <!-- Single Wall -->
      <template v-if="this.cardboard.number_of_walls === '1'">
        <wall-details :cardboard="cardboard" :wall="1" :is-last-wall="false"></wall-details>
        <wall-details :cardboard="cardboard" :wall="2" :is-last-wall="true"></wall-details>
      </template>
      <!-- / Single Wall -->

      <!-- Double Wall -->
      <template v-if="this.cardboard.number_of_walls === '2'">
        <wall-details :cardboard="cardboard" :wall="1" :is-last-wall="false"></wall-details>
        <wall-details :cardboard="cardboard" :wall="2" :is-last-wall="false"></wall-details>
        <wall-details :cardboard="cardboard" :wall="3" :is-last-wall="true"></wall-details>
      </template>
      <!-- / Double Wall -->

      <!-- Triple Wall -->
      <template v-if="this.cardboard.number_of_walls === '3'">
        <wall-details :cardboard="cardboard" :wall="1" :is-last-wall="false"></wall-details>
        <wall-details :cardboard="cardboard" :wall="2" :is-last-wall="false"></wall-details>
        <wall-details :cardboard="cardboard" :wall="3" :is-last-wall="false"></wall-details>
        <wall-details :cardboard="cardboard" :wall="4" :is-last-wall="true"></wall-details>
      </template>
      <!-- / Triple Wall -->
    </div>
    <!-- / Wall Details -->
  </div>
</template>

<script>
import NumberOfWallsSelector from "./CorrugatedCardboardProperties/NumberOfWallsSelector";
import WallDetails from "./CorrugatedCardboardProperties/WallDetails";

export default {
  name: "CorrugatedCardboardProperties",
  props: ["cardboard"],
  components: { NumberOfWallsSelector, WallDetails },
  data() {
    return {
      updateKey: 1,
      singleFaceAccordionKey: null,
    };
  },
  methods: {
    handlePropertyUpdated() {
      this.$emit("property-updated");
      this.incrementUpdateKey();
    },

    incrementUpdateKey() {
      this.updateKey = this.updateKey + 1;
    },
  },
};
</script>

<style scoped>
.wall-details {
  /*padding-left: 20px;*/
  /*padding-right: 20px;*/
}
</style>
