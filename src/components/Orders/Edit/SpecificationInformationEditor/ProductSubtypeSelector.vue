<template>
  <div class="pill-selector">
    <a-button
      :class="{ selected: isSelected(subtype) }"
      shape="round"
      :key="subtype"
      v-for="subtype in subtypesForSelectedProductType"
      @click="select(subtype)"
    >
      {{ getHumanReadableSubtype(subtype) }}
    </a-button>
  </div>
</template>

<script>
let _ = require("lodash");

const SUBTYPES = {
  print: [
    "leaflet",
    "brochure",
    "book",
    "poster",
    "envelope",
    "business_card",
    // 'binder',
    "pad",
    "letterhead",
    "postcard",
    "business_form",
  ],
  pos: ["permanent", "semi_permanent"],
  apparel: ["t-shirt", "hoodie", "sweater"],
  packaging: ["boxes", "bubble-wrap", "strapping", "jiffy-bag", "pallet-wrap"],
};

export default {
  name: "ProductSubtypeSelector",
  props: ["orderLocal"],
  data() {
    return {
      selected: null,
    };
  },
  mounted() {
    this.selected = this.orderLocal.product_subtype;
  },
  watch: {
    selected(newSelection) {
      this.orderLocal.product_subtype = newSelection;
      this.$emit("property-updated");
    },
  },
  computed: {
    subtypesForSelectedProductType() {
      return SUBTYPES[this.orderLocal.product_type];
    },
  },
  methods: {
    getHumanReadableSubtype(subtype) {
      let parts = subtype.split("_");
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
