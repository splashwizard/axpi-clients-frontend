<template>
  <a-button :type="isMatchSelected ? 'danger' : 'default'" @click.prevent="toggle">
    {{ isMatchSelected ? "Unmatch" : "Match" }}
  </a-button>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

const _ = require("lodash");

export default {
  name: "ToggleMatchSelectedButton",
  props: ["match"],
  methods: {
    ...mapActions("matcher", {
      toggleMatchSelected: "toggleMatchSelected",
    }),

    toggle() {
      this.toggleMatchSelected(this.matchId);
    },
  },
  computed: {
    ...mapGetters("matcher", {
      selectedMatches: "selectedMatches",
    }),

    matchId() {
      if (typeof this.match["_id"] === "string") {
        return this.match["_id"];
      } else {
        return Object.values(this.match["_id"])[0];
      }
    },

    isMatchSelected() {
      return _.includes(this.selectedMatches, this.matchId);
    },
  },
};
</script>

<style scoped></style>
