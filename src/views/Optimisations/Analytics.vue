<template>
  <div class="optimisations">
    <loading-screen :is-loading="isLoading"></loading-screen>

    <a-layout>
      <a-layout style="padding: 20px 30px">
        <div class="page-header" v-if="optimisation">
          <h1 class="page-title">{{ optimisation.name }} - Analytics</h1>
          <div class="actions">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>Scenarios</span>
              </template>
              <a-button type="secondary" class="button-header" size="large" shape="circle"
                        @click="() => (scenarioSidebarCollapsed = !scenarioSidebarCollapsed)"
                        icon="form"></a-button>
            </a-tooltip>
          </div>
        </div>

        <div v-if="optimisation">
          The analytics go here
        </div>
      </a-layout>
      <a-layout-sider width="270" theme="dark"
                      :style="{ background: '#f7fafc', borderLeft: '1px solid #e3e8ee' }"
                      :collapsed-width="0" v-model="scenarioSidebarCollapsed" :trigger="null" collapsible>
        <div>

          <!-- Analytics Sidebar Header -->
          <div class="analytics-sidebar-header">
            <div class="left">
              <h1>Scenarios</h1>
            </div>
            <div class="right">

            </div>
          </div>
          <!-- / Analytics Sidebar Header -->

          <!-- Analytics Sidebar Body -->
          <div class="analytics-sidebar-body">

            <!-- Scenarios -->
            <div v-if="!selectedScenario" class="scenarios-list">

              <!-- Scenario -->
              <div class="scenario" v-for="(scenario, i) in scenarios" :key="i">
                <div class="left">
                  <b class="mb-2">{{ scenario.name }}</b>
                  <div>3/5 items</div>
                </div>
                <div class="right">
                  <a-dropdown :trigger="['click']">
                    <a-button type="link" icon="ellipsis" @click.prevent="e => e.preventDefault()"></a-button>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a href="#">Edit</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="#" @click.prevent="e => e.preventDefault()">Duplicate</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="#" @click.prevent="e => e.preventDefault()"
                           class="text-danger">Delete</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </div>
              <!-- / Scenario -->

            </div>
            <!-- / Scenarios -->

            <!-- Add Scenario Buttons -->
            <div>
              <div class="button-space-above">
                <a-button icon="plus" type="primary" block>New Custom Scenario</a-button>
              </div>
              <div class="button-space-above">
                <a-button icon="plus" type="primary" block>New Optimised Scenario</a-button>
              </div>
            </div>
            <!-- / Add Scenario Buttons -->

          </div>
          <!-- / Analytics Sidebar Body -->

        </div>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
  name: "Show",
  created() {
    this.loadOptimisation(this.$route.params.id);
  },
  watch: {
    $route() {
      this.loadOptimisation(this.$route.params.id);
    }
  },
  data() {
    return {
      scenarioSidebarCollapsed: true,
      selectedScenario: null,
      scenarios: [
        {
          name: 'Demo Scenario 1'
        },
        {
          name: 'Demo Scenario 2'
        }
      ]
    }
  },
  components: {},
  computed: {
    ...mapGetters('optimisationEditor', {
      isLoading: 'isLoading',
      optimisation: 'optimisation'
    })
  },
  methods: {
    refresh() {
      this.loadOptimisation(this.$route.params.id);
    },

    ...mapActions('optimisationEditor', {
      loadOptimisation: 'loadOptimisation'
    }),

    selectScenario(scenario) {
      this.selectedScenario = scenario;
    }
  }
}
</script>

<style scoped lang="scss">
.optimisations {
  height: 100%;
}

.button-header {
  border: none !important;
  box-shadow: none !important;
}

.button-header:hover {
  background: rgb(55, 53, 179);
  color: #fff;
}

.analytics-sidebar-header {
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;

  .left {
    flex: 1;
    font-size: 26px;
  }

  .right {
    flex-shrink: 1;
  }
}

.analytics-sidebar-body {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}

.scenario {
  margin-bottom: 15px;
  background: #fff;
  padding: 7px 20px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;

  .left {
    flex: 1;
  }

  .right {
    flex-shrink: 1;
  }

  &:hover {
    background: #f1f1;
    cursor: pointer;
  }
}

.scenario::before {
  display: block;
  content: "";
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: #5469d4;
  position: absolute;
}

.button-space-above {
  margin-top: 15px;
}
</style>