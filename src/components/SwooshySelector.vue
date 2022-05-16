<template>
  <div class="swooshy-selector">
    <div class="arrow-container">
      <a-button @click="goBack" type="link" shape="circle" icon="left" />
    </div>
    <div class="label-container">
      <div>
        {{ selected[this.labelAttr] }}
      </div>
    </div>
    <div class="arrow-container">
      <a-button @click="goForward" type="link" shape="circle" icon="right" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "options", "label"],
  name: "SwooshySelector",
  data() {
    return {
      indexOfSelected: 0,
    };
  },
  created() {
    this.indexOfSelected = this.options.indexOf(this.value);
    if (this.indexOfSelected < 0) {
      this.indexOfSelected = 0;
    }
    this.$emit("input", this.selected);
  },
  computed: {
    labelAttr() {
      if (this.label) {
        return this.label;
      } else {
        return "label";
      }
    },

    selected() {
      return this.options[this.indexOfSelected];
    },
  },
  methods: {
    goForward() {
      this.indexOfSelected += 1;
      if (this.indexOfSelected > this.options.length - 1) {
        this.indexOfSelected = 0;
      }
      this.$emit("input", this.selected);
    },

    goBack() {
      this.indexOfSelected -= 1;
      if (this.indexOfSelected < 0) {
        this.indexOfSelected = this.options.length - 1;
      }
      this.$emit("input", this.selected);
    },
  },
};
</script>

<style scoped lang="scss">
.swooshy-selector {
  display: flex;
  flex-direction: row;

  div {
    display: flex;
  }

  .arrow-container {
    flex-shrink: 1;
  }

  .label-container {
    flex: 1;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
    flex-direction: row;
  }
}
</style>
