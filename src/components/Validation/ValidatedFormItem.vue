<template>
  <a-form-item :validate-status="validateStatus">
    <!--      :label="label">-->
    <div class="validated-form-item-label">
      <span class="label-lhs">{{ label }}</span>
      <infobox v-for="(singularId, i) in ids" :key="i" :id="singularId"></infobox>
    </div>
    <slot></slot>
  </a-form-item>
</template>

<script>
import { mapGetters } from "vuex";

const _ = require("lodash");

export default {
  name: "ValidatedFormItem",
  props: ["label", "id", "conditions"],
  computed: {
    ...mapGetters("orderEditor", {
      validationErrors: "validationErrors",
    }),

    ids() {
      if (this.id) {
        return this.id.split(",");
      }
      return [];
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

    hasErrors() {
      return this.errorsForField.length > 0;
    },

    validateStatus() {
      return this.hasErrors ? "error" : "success";
    },
  },
};
</script>

<style>
.label-lhs {
  margin-right: 8px;
  font-weight: 500;
}

.validated-form-item-label {
  margin-bottom: 10px !important;
}
</style>
