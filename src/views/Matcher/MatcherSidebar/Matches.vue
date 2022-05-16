<template>
  <div class="wrapper">
    <!-- No matches -->
    <a-alert type="error" message="No matches" v-if="allMatches.length === 0" banner />
    <!-- / No matches -->

    <!-- Matches -->
    <div class="wrapper matches-list-wrapper" v-if="allMatches.length" :key="matchSelectedReloadKey">
      <a-list item-layout="horizontal" :data-source="allMatches">
        <match-list-item slot="renderItem" slot-scope="item" :list-item="item"></match-list-item>
      </a-list>
    </div>
    <!-- / Matches -->
  </div>
</template>

<script>
import MatchListItem from "./Matches/MatchListItem";

const _ = require("lodash");
import { mapGetters } from "vuex";

export default {
  props: ["matches", "idsOfManualSelections"],
  name: "Matches",
  components: { MatchListItem },
  data() {
    return {
      showMoreDetailsForIds: [],
    };
  },
  methods: {
    getImageSrc(order) {
      if (order["Images"] && order["Images"].length) {
        return order["Images"][0];
      }
    },

    toggleShowMoreDetailsFor(order) {
      this.showMoreDetailsForIds = _.xor(this.showMoreDetailsForIds, [order["_id"]]);
    },
  },
  computed: {
    ...mapGetters("matcher", {
      matchSelectedReloadKey: "matchSelectedReloadKey",
    }),

    allMatches() {
      let allMatches = [];

      _.each(this.idsOfManualSelections, (s) => {
        allMatches.push({
          type: "id",
          value: s,
        });
      });

      _.each(this.matches, (m) => {
        allMatches.push({
          type: "product",
          value: m,
        });
      });

      return allMatches;
    },
  },
};
</script>

<style scoped>
.wrapper {
  max-height: 100%;
  overflow-y: scroll;
}

.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}

.product-description b {
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
}

.matches-list-wrapper {
  /*max-height: 350px;*/
  overflow-y: scroll;
}
</style>
