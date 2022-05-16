<template>
  <div>
    <!-- Loading -->
    <div class="loading-screen" v-if="isLoadingSuggestedMatches">
      <a-spin />
    </div>
    <!-- / Loading -->

    <!-- Loaded -->
    <div v-if="!isLoadingSuggestedMatches">
      <!-- No matches -->
      <a-alert type="error" message="No suggested matches" v-if="suggestedMatches.length === 0" banner />
      <!-- / No matches -->

      <!-- Matches -->
      <div class="wrapper" v-if="suggestedMatches.length">
        <matches :matches="suggestedMatches"></matches>
      </div>
      <!-- / Matches -->
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// const _ = require('lodash');
import Matches from "./Matches";

export default {
  name: "SuggestedMatches",
  components: { Matches },
  computed: {
    ...mapGetters("matcher", {
      selectedErpOrder: "selectedErpOrder",
      isLoadingSuggestedMatches: "isLoadingSuggestedMatches",
      suggestedMatches: "suggestedMatches",
    }),
  },
  data() {
    return {
      showMoreDetailsForIds: [],
    };
  },
  methods: {},
};
</script>

<style scoped>
.wrapper {
  max-height: 100%;
  overflow-y: scroll;
}
</style>

<style scoped>
.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}

.product-description b {
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
}
</style>
