<template>
  <div class="binding-details-wrapper">
    <inline-validation-errors id="print-detail-binding"></inline-validation-errors>
    <a-spin v-if="isDropdownLoading('paper-binding')" />
    <div class="pill-selector">
      <a-button
        :class="{ selected: isSelected(bindingType) }"
        shape="round"
        :key="bindingType"
        v-for="bindingType in bindingTypes"
        @click="select(bindingType)"
      >
        {{ bindingType }}
      </a-button>
    </div>
  </div>
</template>

<script>
let _ = require("lodash");

// const BINDING_TYPES = {
//   'leaflet': [
//     'saddle_stitched',
//     'perfect_bound',
//     'pur_bound',
//     'case_bound',
//     'screw_post_bound',
//     '3-Hole_punch_bound',
//     'thermal_bound',
//     'spiral_bound',
//     'wire-O_bound',
//     'plastic_comb_bound',
//     'board_bound',
//     'glued_fold_bound',
//     'thread_swen_bound',
//     'burst_bound',
//     'lock_bound',
//     'section_sewn',
//     'case_bound_section_sewn'
//   ],
//   'brochure': [
//     'saddle_stitched',
//     'perfect_bound',
//     'pur_bound',
//     'case_bound',
//     'screw_post_bound',
//     '3-Hole_punch_bound',
//     'thermal_bound',
//     'spiral_bound',
//     'wire-O_bound',
//     'plastic_comb_bound',
//     'board_bound',
//     'glued_fold_bound',
//     'thread_sewn_bound'
//   ],
//   'book': [
//     'saddle_stitched',
//     'perfect_bound',
//     'pur_bound',
//     'case_bound',
//     'screw_post_bound',
//     '3-Hole_punch_bound',
//     'thermal_bound',
//     'spiral_bound',
//     'wire-O_bound',
//     'plastic_comb_bound',
//     'board_bound',
//     'glued_fold_bound',
//     'thread_sewn_bound'
//   ]
// };

import Forms from "../../../../../mixins/Forms";

export default {
  name: "ProductSubtypeSelector",
  props: ["orderLocal"],
  mixins: [Forms],
  data() {
    return {
      selected: null,
      allBindings: [],
    };
  },
  computed: {
    subtype() {
      return this.orderLocal.product_subtype;
    },

    bindingTypes() {
      // if (this.subtype in BINDING_TYPES) {
      //   return BINDING_TYPES[this.subtype];
      // }
      // return [];
      let forSubtype = _.filter(this.allBindings, (bindingType) => {
        return bindingType.subtype === this.subtype;
      });
      return _.map(forSubtype, "name");
    },
  },
  mounted() {
    this.selected = this.orderLocal.print_binding_type;
    this.getDropdownOptions("paper-binding", "allBindings");
  },
  watch: {
    selected(newSelection) {
      this.orderLocal.print_binding_type = newSelection;
      this.$emit("property-updated");
    },
  },
  methods: {
    getHumanReadableSubtype(bindingType) {
      if (bindingType === "pur_bound") {
        return "PUR Bound";
      }

      let parts = bindingType.split("_");
      parts = _.map(parts, (part) => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      });
      return parts.join(" ");
    },

    select(key) {
      this.selected = key;
    },

    isSelected(key) {
      return this.selected === key;
    },
  },
};
</script>

<style scoped></style>
