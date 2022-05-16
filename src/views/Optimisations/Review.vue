<template>
  <div class="optimisations">
    <loading-screen
      :is-loading="isLoading || isLoadingSpecifications || isLoadingSuppliers || isLoadingScenario"
    ></loading-screen>

    <a-layout>
      <left-sidebar :optimisation="optimisation"></left-sidebar>
      <a-layout style="padding: 7px 30px">
        <div class="page-header" v-if="optimisation">
          <h1 class="page-title">{{ optimisation.name }}</h1>
          <div class="actions" style="padding-top: 15px">
            <a-button icon="share-alt">Share</a-button>
            <review-export-button-and-modal></review-export-button-and-modal>
            <!--            <a-button icon="export" type="primary">Export</a-button>-->
          </div>
        </div>

        <div v-if="optimisation && scenario">
          <review-table :optimisation="optimisation" :table-data="tableData"></review-table>
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import LeftSidebar from "./LeftSidebar";
import ReviewTable from "./Review/ReviewTable";
import ReviewExportButtonAndModal from "./Review/ReviewExportButtonAndModal";

const _ = require("lodash");

export default {
  name: "Show",
  created() {
    this.loadOptimisation(this.$route.params.id);
    // this.loadSpecifications(this.$route.params.id);
    this.loadSuppliers();
    this.loadScenario(this.$route.params.id, this.$route.params.scenarioId);
  },
  watch: {
    $route() {
      this.loadOptimisation(this.$route.params.id);
      // this.loadSpecifications(this.$route.params.id);
      this.loadSuppliers();
      this.loadScenario(this.$route.params.id, this.$route.params.scenarioId);
    },
  },
  data() {
    return {
      sidebarCollapsed: true,
      selectedSidebar: "",

      route: "all-scenarios",
      selectedScenario: null,
      scenarios: [
        {
          name: "Demo Scenario 1",
          items: [],
        },
        {
          name: "Demo Scenario 2",
          items: [],
        },
      ],

      isLoadingSpecifications: false,
      specifications: [],

      isLoadingSuppliers: false,
      suppliers: [],

      isLoadingScenario: false,
      scenario: null,
    };
  },
  components: { LeftSidebar, ReviewTable, ReviewExportButtonAndModal },
  computed: {
    ...mapGetters("optimisationEditor", {
      isLoading: "isLoading",
      optimisation: "optimisation",
    }),

    mappings() {
      if (this.scenario) {
        return _.map(this.scenario.optimisation_scenario_specification_supplier_mappings, (mapping) => {
          return {
            spec_name: mapping.optimisation_specification.product_name,
            spec_quantity: mapping.optimisation_specification.quantity,
            supplier_name: mapping.supplier.name,
            ...mapping,
          };
        });
      }
      return [];
    },

    mappingsGroupedBySpec() {
      return _.groupBy(this.mappings, "spec_name");
    },

    tableData() {
      let data = [];

      _.each(this.mappingsGroupedBySpec, (specMappings, specName) => {
        let expectedPrices = _.map(specMappings, (mapping) => {
          return mapping.expected_price / 100;
        });
        let co2es = _.map(specMappings, "co2e");

        let specDetails = {
          name: specName,
          quantity: _.first(specMappings).spec_quantity,
          min_expected_price: _.min(expectedPrices),
          max_expected_price: _.max(expectedPrices),
          min_co2e: _.min(co2es),
          max_co2e: _.max(co2es),
          number_of_suppliers: specMappings.length,
          supplier: _.first(specMappings).supplier.name,
          mappings: specMappings,
        };
        data.push(specDetails);
      });

      return data;
    },
  },
  methods: {
    navigateTo(route) {
      this.route = route;
    },

    refresh() {
      this.loadOptimisation(this.$route.params.id);
    },

    ...mapActions("optimisationEditor", {
      loadOptimisation: "loadOptimisation",
    }),

    selectScenario(scenario) {
      this.selectedScenario = scenario;
    },

    closeCreateScenario() {
      this.selectedScenario = null;
      this.navigateTo("all-scenarios");
    },

    addNewScenario() {
      let scenario = {
        name: "Untitled",
        items: [],
      };
      this.scenarios.push(scenario);
      this.selectedScenario = scenario;
      this.navigateTo("edit-scenario");
    },

    editScenario(scenario) {
      this.selectedScenario = scenario;
      this.navigateTo("edit-scenario");
    },

    addItemToScenario() {
      this.selectedScenario.items.push({
        optimisationSpecificationId: null,
        supplierId: null,
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
      axios
        .get(window.API_BASE + "/optimisations/" + optimisationId + "/specifications")
        .then((r) => {
          vm.specifications = r.data;
          vm.isLoadingSpecifications = false;
        })
        .catch((e) => {
          vm.specifications = [];
          console.log(e);
          this.$message.error("Error loading specifications");
          vm.isLoadingSpecifications = false;
        });
    },

    loadSuppliers() {
      let vm = this;
      vm.isLoadingSuppliers = true;
      vm.suppliers = [];
      axios
        .get(window.API_BASE + "/suppliers")
        .then((r) => {
          vm.suppliers = r.data;
          vm.isLoadingSuppliers = false;
        })
        .catch((e) => {
          vm.suppliers = [];
          console.log(e);
          this.$message.error("Error loading suppliers");
          vm.isLoadingSuppliers = false;
        });
    },

    loadScenario(optimisationId, scenarioId) {
      let vm = this;
      vm.isLoadingScenario = false;
      vm.scenario = null;
      axios
        .get(window.API_BASE + "/optimisations/" + optimisationId + "/scenarios/" + scenarioId)
        .then((r) => {
          vm.scenario = r.data;
          vm.isLoadingScenario = false;
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("Error loading scenario");
          vm.isLoadingScenario = false;
        });
    },

    toggleSidebar(sidebarName) {
      if (this.selectedSidebar !== sidebarName) {
        this.selectedSidebar = sidebarName;
        this.sidebarCollapsed = false;
        if (sidebarName === "scenarios") {
          this.route = "all-scenarios";
        }
      } else {
        this.sidebarCollapsed = !this.sidebarCollapsed;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.optimisations {
  height: 100%;
}

.button-header {
  border: none !important;
  box-shadow: none !important;
  font-size: 19px;
  //width: 40px;
  //height: 40px;
}

.button-header:hover {
  background: rgb(55, 53, 179);
  color: #fff;
}

.analytics-sidebar-header {
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 9px;
  padding-bottom: 9px;
  border-bottom: 1px solid rgb(227, 232, 238);

  .left {
    flex: 1;
    font-size: 26px;
    display: flex;
    align-items: center;

    i {
      display: inline;
      //font-size: 23px;
      font-size: 19px;
      margin-right: 15px;
    }

    h1 {
      display: inline;
      font-size: 20px;
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

.share-button {
  text-align: left;
  height: 50px;
}

.share-button {
  display: flex;
  align-items: center;
}

.share-button i {
  flex-shrink: 1;
}

.share-button-inner {
  padding-left: 20px;
  flex: 1;
  display: flex;
  align-items: center;
}

.share-button-inner .share-button-text {
  flex: 1;
}

.button-margin-bottom {
  margin-bottom: 15px;
}

.collapse-margin-bottom {
  margin-bottom: 20px;
}

.ant-collapse-content-box .ant-btn,
.ant-collapse-content-box .ant-btn span {
  width: 100%;
  word-wrap: break-word;
  height: auto;
  white-space: normal;
  text-align: left;
  padding-top: 5px;
  padding-bottom: 5px;
}

.ant-collapse-content-box .ant-btn {
  margin-bottom: 15px;
}

.ant-collapse-content-box .ant-btn:last-child {
  margin-bottom: 0 !important;
}
</style>
