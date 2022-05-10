<template>
  <div>
    <ais-refinement-list v-for="attr in attrs" :key="attr.name" :attribute="attr.name">
      <template v-slot="{ items, refine }">
        <filter-options :items="items" :refine="refine" :title="attr.title" />
      </template>
    </ais-refinement-list>
  </div>
</template>

<script>
import _ from "lodash";
import FilterOptions from "./FilterOptions";

const defaultAttrs = [
  {
    name: "category_breadcrumbs",
    title: "Category",
  },
  {
    name: "manufacturer",
    title: "Manufacturer",
  },
  {
    name: "supplier",
    title: "Supplier",
  },
];

export default {
  name: "ShopFilterOptions",
  props: ["results"],
  components: {
    FilterOptions,
  },
  data() {
    return {
      attrs: defaultAttrs,
    };
  },
  watch: {
    results: function (val) {
      if (val && val.length) {
        this.getAttrs(val);
      }
    },
  },
  methods: {
    getAttrs(results) {
      let keys = [];
      for (const r of results) {
        keys = [...keys, ...Object.keys(r)];
      }

      const propertyKeys = _.uniq(keys).filter((key) => key.startsWith("properties."));
      const extraAttrs = propertyKeys
        .map((key) => ({
          name: key,
          title: key.replace("properties.", ""),
        }))
        .filter((i) => !i.name.toLowerCase().includes("description") || !i.name.toLowerCase().includes("name"));

      this.attrs = [...defaultAttrs, ...extraAttrs];
    },
  },
};
</script>

<style></style>
