<template>
  <a-layout-sider
    width="170"
    theme="dark"
    :style="{ background: '#f7fafc', borderRight: '1px solid #e3e8ee' }"
    :collapsed-width="0"
    :trigger="null"
  >
    <div class="wrapper">
      <div class="sidebar-menu">
        <router-link to="/search/analytics" :class="{ selected: isAnalytics }">Analytics</router-link>
        <router-link to="/search/rules" :class="{ selected: isRules }">Rules</router-link>
      </div>
      <div class="sidebar-footer" />
    </div>
  </a-layout-sider>
</template>

<script>
export default {
  name: "LeftSidebar",
  methods: {},
  computed: {
    isAnalytics() {
      return this.$route.name === "Search Analytics";
    },

    isRules() {
      return this.$route.name === "Search Rules";
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.sidebar-menu {
  flex: 1;
}

.sidebar-menu {
  padding-top: 20px;

  a {
    width: 100%;
    display: block;
    margin-bottom: 19px;
    font-size: 15px;
    color: #4f566b;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;

    &.selected {
      font-weight: bold;

      &:before {
        content: "";
        box-shadow: 0 0 10px #9ecaed;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: #3735b3;
      }
    }
  }
}

.sidebar-footer {
  flex-shrink: 1;
  padding: 10px 10px;
}
</style>
