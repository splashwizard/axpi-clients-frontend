<template>
  <div class="optimisations">
    <loading-screen :is-loading="isLoading||isLoadingSpecifications||isLoadingSuppliers"></loading-screen>

    <a-layout>
      <a-layout style="padding: 7px 30px">
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
      <a-layout-sider width="300" theme="dark"
                      :style="{ background: '#f7fafc', borderLeft: '1px solid #e3e8ee' }"
                      :collapsed-width="0" v-model="scenarioSidebarCollapsed" :trigger="null" collapsible>
        <div>

          <!-- Analytics Sidebar Header -->
          <div class="analytics-sidebar-header">
            <div class="left">
              <a-icon v-if="route === 'all-scenarios'" type="form"/>

              <a-icon @click.prevent="closeCreateScenario" class="back-button"
                      v-if="route === 'edit-scenario'" type="arrow-left"/>

              <!--              <a-button v-if="route === 'new-custom-scenario'"-->
              <!--                         type="link" size="large" shape="circle"-->
              <!--                        @click="e => e.preventDefault()"-->
              <!--                        icon="arrow-left" class="back-icon"></a-button>-->

              <h1 v-if="route === 'all-scenarios'">Scenarios</h1>
              <input v-if="route === 'edit-scenario'" v-model="selectedScenario.name"
                     class="edit-name-input"
                     type="text">
            </div>
            <div class="right">
              <a-button type="link" size="large" shape="circle"
                        @click="() => (scenarioSidebarCollapsed = !scenarioSidebarCollapsed)"
                        icon="close" class="close-icon"></a-button>
            </div>
          </div>
          <!-- / Analytics Sidebar Header -->

          <!-- Analytics Sidebar Body -->
          <div class="analytics-sidebar-body">

            <!-- Scenarios -->
            <div v-if="route === 'all-scenarios'" class="scenarios-list">

              <!-- Scenario -->
              <div class="scenario" v-for="(scenario, i) in scenarios" :key="i" @click="editScenario(scenario)">
                <div class="left">
                  <b class="mb-2">{{ scenario.name }}</b>
                  <div>{{ scenario.items ? scenario.items.length : 0 }}/{{ specifications ? specifications.length : 0 }} items</div>
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

              <!-- Add Scenario Buttons -->
              <div>
                <div class="button-space-above">
                  <a-button icon="plus" type="default" class="scenario-button" block
                            @click.native="addNewScenario">New Custom Scenario
                  </a-button>
                </div>
              </div>
              <!-- / Add Scenario Buttons -->

            </div>
            <!-- / Scenarios -->

            <!-- New Custom Scenario -->
            <div v-if="route === 'edit-scenario'">

              <!-- Items -->
              <div class="scenario-items" v-if="selectedScenario">

                <div class="scenario-item" v-for="(item, key) in selectedScenario.items" :key="key">
                  <div class="scenario-item-bin">
                    <a-button icon="delete" @click.prevent="deleteItem(item)" type="link"></a-button>
                  </div>

                  <!-- Specification Input -->
                  <div class="scenario-item-input">
                    <label for="Specification">Specification</label>
                    <a-select
                        placeholder="Select item"
                        @change="forceRefresh" v-model="item.optimisationSpecificationId" show-search>
                      <a-select-option v-for="spec in specifications" :value="spec.id" :key="spec.id">
                        {{ spec.product_name }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <!-- / Specification Input -->

                  <!-- Supplier Input -->
                  <div class="scenario-item-input">
                    <label for="Supplier">Supplier</label>
                    <a-select
                        placeholder="Select item"
                        @change="forceRefresh" v-model="item.supplierId" show-search>
                      <a-select-option v-for="supplier in suppliers" :value="supplier.id" :key="supplier.id">
                        {{ supplier.name }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <!-- / Supplier Input -->
                </div>

              </div>
              <!-- / Items -->

              <a-button icon="plus" type="default" class="scenario-button" block
                        @click.native="addItemToScenario">
                Add Item
              </a-button>

            </div>
            <!-- / New Custom Scenario -->

          </div>
          <!-- / Analytics Sidebar Body -->

        </div>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import axios from 'axios';

const _ = require('lodash');

export default {
  name: "Show",
  created() {
    this.loadOptimisation(this.$route.params.id);
    this.loadSpecifications(this.$route.params.id);
    this.loadSuppliers();
  },
  watch: {
    $route() {
      this.loadOptimisation(this.$route.params.id);
      this.loadSpecifications(this.$route.params.id);
      this.loadSuppliers();
    }
  },
  data() {
    return {
      scenarioSidebarCollapsed: true,
      route: 'all-scenarios',
      selectedScenario: null,
      scenarios: [
        {
          name: 'Demo Scenario 1',
          items: []
        },
        {
          name: 'Demo Scenario 2',
          items: []
        }
      ],

      isLoadingSpecifications: false,
      specifications: [],

      isLoadingSuppliers: false,
      suppliers: []
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
    navigateTo(route) {
      this.route = route;
    },

    refresh() {
      this.loadOptimisation(this.$route.params.id);
    },

    ...mapActions('optimisationEditor', {
      loadOptimisation: 'loadOptimisation'
    }),

    selectScenario(scenario) {
      this.selectedScenario = scenario;
    },

    closeCreateScenario() {
      this.selectedScenario = null;
      this.navigateTo('all-scenarios');
    },

    addNewScenario() {
      let scenario = {
        name: 'Untitled',
        items: []
      }
      this.scenarios.push(scenario);
      this.selectedScenario = scenario;
      this.navigateTo('edit-scenario');
    },

    editScenario(scenario) {
      this.selectedScenario = scenario;
     this.navigateTo('edit-scenario');
    },

    addItemToScenario() {
      this.selectedScenario.items.push({
        optimisationSpecificationId: null,
        supplierId: null
      });
    },

    deleteItem(item) {
      this.selectedScenario.items = _.without(this.selectedScenario.items, item);
    },

    forceRefresh() {
      this.$forceUpdate();
    },

    loadSpecifications(optimisationId) {
      let vm = this;
      vm.isLoadingSpecifications = true;
      vm.specifications = [];
      axios.get(window.API_BASE + '/optimisations/' + optimisationId + '/specifications').then(r => {
        vm.specifications = r.data;
        vm.isLoadingSpecifications = false;
      }).catch(e => {
        vm.specifications = [];
        console.log(e);
        this.$message.error('Error loading specifications');
        vm.isLoadingSpecifications = false;
      });
    },

    loadSuppliers() {
      let vm = this;
      vm.isLoadingSuppliers = true;
      vm.suppliers = [];
      axios.get(window.API_BASE + '/suppliers').then(r => {
        vm.suppliers = r.data;
        vm.isLoadingSuppliers = false;
      }).catch(e => {
        vm.suppliers = [];
        console.log(e);
        this.$message.error('Error loading suppliers');
        vm.isLoadingSuppliers = false;
      });
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
  font-size: 23px;
  width: 45px;
  height: 45px;
}

.button-header:hover {
  background: rgb(55, 53, 179);
  color: #fff;
}

.analytics-sidebar-header {
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgb(227, 232, 238);

  .left {
    flex: 1;
    font-size: 26px;
    display: flex;
    align-items: center;;

    i {
      display: inline;
      font-size: 23px;
      margin-right: 15px;
    }

    h1 {
      display: inline;
      margin-bottom: 0;
    }
  }

  .right {
    flex-shrink: 1;

    .close-icon {
      color: rgba(0, 0, 0, 0.65);
    }
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
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  border: 1px solid #e3e8ee;

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

//.scenario-button {
//  color: #5469d4;
//  background: #fff;
//  text-shadow: none;
//  box-shadow: none;
//}

.scenario-item {
  margin-bottom: 15px;
  background: #fff;
  padding: 15px 15px 10px;
  border-radius: 6px;
  position: relative;
  border: 1px solid #e3e8ee;
}

.scenario-item label {
  display: block;
  margin-bottom: 4px;
}

.scenario-item-input {
  margin-bottom: 15px;
}

.scenario-item .ant-select {
  width: 100%;
}

.scenario-item-bin {
  position: absolute;
  right: 2px;
  top: 2px;
}

.edit-name-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 20px;
}
</style>