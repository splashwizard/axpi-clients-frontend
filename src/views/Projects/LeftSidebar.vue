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
        <a :href="overviewHref" :class="{ selected: isOverview }">Overview</a>
        <a :href="teamHref" :class="{ selected: isTeam }">Team</a>
        <a :href="chatHref" :class="{ selected: isChat }">Chat</a>
        <a :href="actionsHref" :class="{ selected: isActions }">Actions</a>
        <a :href="ordersHref" :class="{ selected: isOrders }">Orders</a>
        <!--        <a :href="reviewHref" :class="{'selected': isReview}">Review</a>-->
      </div>
      <div class="sidebar-footer">
        <!--        <a-button block type="primary" @click="saveAndExit">Save and exit</a-button>-->
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
export default {
  name: "LeftSidebar",
  props: ["project"],
  methods: {
    saveAndExit() {
      this.$router.push("/projects");
    },
  },
  computed: {
    isScenarios() {
      return this.$route.name === "Optimisation Scenarios";
    },

    scenarioHref() {
      if (this.optimisation) {
        return "/optimisations/" + this.optimisation.id + "/scenarios";
      }
      return "#";
    },

    isOverview() {
      return this.$route.name === "View Project";
    },

    overviewHref() {
      if (this.project) {
        return "/projects/" + this.project.id;
      }
      return "#";
    },

    isTeam() {
      return this.$route.name === "Project Team";
    },

    teamHref() {
      if (this.project) {
        return "/projects/" + this.project.id + "/team";
      }
      return "#";
    },

    isChat() {
      return this.$route.name === "Project Chat";
    },

    chatHref() {
      if (this.project) {
        return "/projects/" + this.project.id + "/chat";
      }
      return "#";
    },

    isActions() {
      return this.$route.name === "Project Actions";
    },

    actionsHref() {
      if (this.project) {
        return "/projects/" + this.project.id + "/actions";
      }
      return "#";
    },

    isOrders() {
      return this.$route.name === "Project Orders";
    },

    ordersHref() {
      if (this.project) {
        return "/projects/" + this.project.id + "/orders";
      }
      return "#";
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
