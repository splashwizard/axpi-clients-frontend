<template>
  <div>
    <div class="description-wrapper">
      <div ref="description" class="description" v-html="item.description" :style="{ height: height }">
        <!-- @TODO: need to find out how to render raw html in ais-highlight -->
        <ais-highlight
          :hit="item"
          attribute="description"
          :class-names="{
            'ais-Highlight-highlighted': 'custom-highlighted',
          }"
        />
      </div>
      <div class="gradient-overlay" v-if="isCollapsed"></div>
    </div>
    <div class="btn-wrapper" v-if="longTxt">
      <div class="btn" @click="toggleTxt">
        <a-button type="link"> Show {{ isCollapsed ? "More" : "Less" }} </a-button>
        <a-icon type="caret-down" v-if="isCollapsed" key="i-arrow-down" />
        <a-icon type="caret-up" v-else key="i-arrow-up" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DescriptionShow",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.checkTxtLength();
  },
  data() {
    return {
      height: "100px",
      isCollapsed: false,
      longTxt: false,
    };
  },
  methods: {
    checkTxtLength() {
      const descriptionDOM = this.$refs.description;
      if (!descriptionDOM) {
        return;
      }

      if (descriptionDOM.scrollHeight > descriptionDOM.offsetHeight) {
        this.longTxt = true;
        this.isCollapsed = true;
      }
    },

    toggleTxt() {
      this.isCollapsed = !this.isCollapsed;
      this.height = this.isCollapsed ? "100px" : "auto";
    },
  },
};
</script>

<style lang="scss" scoped>
.description-wrapper {
  position: relative;
  padding-bottom: 14px;
  overflow: hidden;

  .description {
    font-size: 12px;
  }

  .gradient-overlay {
    width: 100%;
    height: 80px;
    position: absolute;
    bottom: 0;
    background: linear-gradient(transparent, #fff);
  }
}

.btn-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  .btn {
    display: flex;
    align-items: center;
    color: #1890ff;

    button {
      padding: 0 4px;
    }
  }
}
</style>
