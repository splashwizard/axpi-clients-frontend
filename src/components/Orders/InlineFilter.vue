<template>
  <div class="filter-wrapper">
    <div class="filter-header">
      <a-checkbox @change="toggleFilterEnabled" :checked="isFilterEnabled">
        {{ label }}
      </a-checkbox>
    </div>
    <div v-if="isFilterEnabled" class="filter">
      <a-select style="width: 100%" v-if="type === 'categorical'" v-model="details">
        <a-select-option v-for="(option, i) in options" :key="i" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
const _ = require("lodash");
export default {
  name: "InlineFilter",
  props: ["filters", "id", "label", "type", "options"],
  data() {
    return {
      details: null,
      watchingEnabled: false,
    };
  },
  created() {
    this.details = this.filters[this.id];
    this.$nextTick(() => {
      this.watchingEnabled = true;
    });
  },
  computed: {
    isFilterEnabled() {
      return _.includes(this.filters.filters_enabled, this.id);
    },
  },
  methods: {
    toggleFilterEnabled() {
      this.filters.filters_enabled = _.xor(this.filters.filters_enabled, [this.id]);
      this.$emit("filter-updated");
    },
  },
  watch: {
    details(newVal) {
      if (this.watchingEnabled) {
        this.filters[this.id] = newVal;
        this.$emit("filter-updated");
      }
    },
  },
};
</script>

<style scoped>
.filter-body {
  padding-top: 10px;
}
</style>
