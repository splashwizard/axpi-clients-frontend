<template>
  <div class="pill-selector">
    <a-button
      :class="{ selected: isSelected(numberOfWalls) }"
      shape="round"
      :key="numberOfWalls.value"
      v-for="numberOfWalls in options"
      @click="select(numberOfWalls)"
    >
      {{ numberOfWalls.label }}
    </a-button>
  </div>
</template>

<script>
let _ = require("lodash");

const NUMBER_OF_WALLS_OPTIONS = [
  {
    value: "single-face",
    label: "Single Face",
  },
  {
    value: "1",
    label: "Single Wall",
  },
  {
    value: "2",
    label: "Double Wall",
  },
  {
    value: "3",
    label: "Triple Wall",
  },
];

export default {
  name: "NumberOfWallsSelector",
  props: ["cardboard"],
  data() {
    return {
      selected: null,
      options: NUMBER_OF_WALLS_OPTIONS,
    };
  },
  mounted() {
    let vm = this;
    let toSelect = _.find(vm.options, function (option) {
      return String(option.value) === String(vm.cardboard.number_of_walls);
    });
    if (toSelect) {
      this.select(toSelect);
    } else {
      this.select(_.first(this.options));
    }
  },
  watch: {
    selected(newSelection) {
      this.cardboard.number_of_walls = newSelection.value;
      this.$emit("property-updated");
    },
  },
  methods: {
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
