<template>
  <div v-if="hasErrors" class="inline-validation-errors">
    <a-alert :message="validationErrorsParsed" type="error" show-icon />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const _ = require("lodash");

export default {
  name: "InlineValidationErrors",
  props: ["id", "conditions"],
  computed: {
    ...mapGetters("orderEditor", {
      validationErrors: "validationErrors",
    }),

    ids() {
      return this.id.split(",");
    },

    errorsForId() {
      let vm = this;
      return _.filter(this.validationErrors, (err) => {
        // return err.rule && err.rule.id === vm.id;
        return err.rule && vm.ids.includes(err.rule.id);
      });
    },

    errorsForField() {
      let errors = [];

      if (this.conditions) {
        _.each(this.errorsForId, (errorForId) => {
          let doesErrorApplyToField = true;
          _.each(this.conditions, (condition) => {
            let propertyValue = errorForId["with"] ? errorForId["with"][condition["field"]] : null;
            let expectedPropertyValue = condition["value"];
            if (propertyValue !== expectedPropertyValue) {
              doesErrorApplyToField = false;
            }
          });
          if (doesErrorApplyToField) {
            errors.push(errorForId);
          }
        });
      } else {
        errors = this.errorsForId;
      }

      return errors;
    },

    validationErrorsParsed() {
      let humanErrors = [];
      _.each(this.errorsForField, (error) => {
        if (error.rule.required) {
          humanErrors.push(error.rule.name + " is required");
        }
      });
      return humanErrors.join(" & ");
    },

    hasErrors() {
      return this.errorsForField.length > 0;
    },
  },
};
</script>

<style scoped>
.inline-validation-errors {
  margin-bottom: 25px !important;
}
</style>
