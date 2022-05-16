<template>
  <div class="validation-errors" v-if="!validationClean">
    <a-alert message="Please fix the following" :description="validationErrorsParsed" type="error" show-icon />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const _ = require("lodash");

export default {
  name: "ValidationErrors",
  computed: {
    ...mapGetters("orderEditor", {
      validationClean: "validationClean",
      validationErrors: "validationErrors",
    }),

    validationErrorsParsed() {
      let humanErrors = [];
      _.each(this.validationErrors, (error) => {
        if (error.rule.required) {
          humanErrors.push(error.rule.name + " is required");
        }
      });
      return humanErrors.join(" & ");
    },
  },
};
</script>

<style scoped>
.validation-errors {
  margin-bottom: 25px;
}
</style>
