<template>
  <div>
    <a-modal v-model="visible" class="fullscreen-modal" :centered="true" title="Edit Scenario" :footer="null">
      <loading-screen :is-loading="isSaving || isLoading"></loading-screen>

      <!-- Loaded -->
      <div v-if="scenario">
        <div class="axpi-form width-large">
          <optimisation-metrics :scenario="scenario"></optimisation-metrics>
          <constraints :optimisation-id="optimisationId" :scenario="scenario"></constraints>
          <other-details :scenario="scenario"></other-details>
          <scenario-details :scenario="scenario"></scenario-details>

          <!-- Form footer -->
          <div class="form-footer">
            <a-button size="large" type="primary" @click="saveAndQuit"> Save And Quit </a-button>
          </div>
          <!-- / Form Footer -->
        </div>
        <!-- / Selector -->

        <!--      <div class="modal-buttons">-->
        <!--        <a-button>Save</a-button>-->
        <!--      </div>-->
      </div>
      <!-- / Loaded -->
    </a-modal>
  </div>
</template>
<script>
import OptimisationMetrics from "./Create/OptimisationMetrics";
import Constraints from "./Create/Constraints";
import OtherDetails from "./Create/OtherDetails";
import ScenarioDetails from "./Create/ScenarioDetails";
import axios from "axios";

const _ = require("lodash");

export default {
  name: "EditScenarioModal",
  props: ["optimisationId", "scenarioId"],
  components: { ScenarioDetails, OptimisationMetrics, Constraints, OtherDetails },
  data() {
    return {
      isLoading: false,
      isSaving: false,
      visible: true,
      scenario: null,
    };
  },
  created() {
    this.loadScenario();
  },
  methods: {
    loadScenario() {
      let vm = this;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/optimisations/" + this.optimisationId + "/scenarios/" + this.scenarioId)
        .then((r) => {
          vm.scenario = r.data;

          if (vm.scenario.weightings) {
            vm.scenario.weightings = JSON.parse(vm.scenario.weightings);
            let weightingTypes = Object.keys(vm.scenario.weightings);
            if (weightingTypes.length === 1 && weightingTypes[0] === "co2e") {
              vm.scenario.optimisation_metric = "environmentally-friendly";
              vm.scenario.custom_metrics = [];
            } else if (weightingTypes.length === 1 && weightingTypes[0] === "cost") {
              vm.scenario.optimisation_metric = "best-price";
              vm.scenario.custom_metrics = [];
            } else {
              vm.scenario.optimisation_metric = "custom";
              vm.scenario.custom_metrics = [];
              _.each(vm.scenario.weightings, (weighting, id) => {
                vm.scenario.custom_metrics.push({
                  id: id,
                  value: weighting,
                });
              });
            }
          } else {
            vm.scenario.weightings = [];
          }

          if (vm.scenario.constraints) {
            vm.scenario.constraints = JSON.parse(vm.scenario.constraints);
          } else {
            vm.scenario.constraints = [];
          }

          if (vm.scenario.tags) {
            vm.scenario.tags = JSON.parse(vm.scenario.tags);
          } else {
            vm.scenario.tags = [];
          }

          vm.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          vm.scenario = null;
          vm.isLoading = false;
          vm.$message.error("Error loading scenario");
        });
    },

    getFormParams() {
      let params = {
        name: this.scenario.name,
        description: this.scenario.description,
        tags: JSON.stringify(this.scenario.tags),
        constraints: JSON.stringify(this.scenario.constraints),
        maximum_number_of_suppliers: this.scenario.maximum_number_of_suppliers,
        optimisation_id: this.optimisationId,
      };

      // Metrics
      if (this.scenario.optimisation_metric === "best-price") {
        params["weightings"] = JSON.stringify({
          cost: 1,
        });
      } else if (this.scenario.optimisation_metric === "environmentally-friendly") {
        params["weightings"] = JSON.stringify({
          co2e: 1,
        });
      } else if (this.scenario.optimisation_metric === "custom") {
        let weightings = {};
        _.each(this.scenario.custom_metrics, (metric) => {
          weightings[metric.id] = metric.value;
        });
        params["weightings"] = JSON.stringify(weightings);
      }

      // Finished :)
      return params;
    },

    saveAndQuit() {
      let vm = this;
      vm.isSaving = true;
      axios
        .put(
          window.API_BASE + "/optimisations/" + this.optimisationId + "/scenarios/" + this.scenarioId,
          this.getFormParams()
        )
        .then(() => {
          vm.isSaving = false;
          vm.$message.success("Scenario updated successfully!");
          vm.$emit("scenario-updated");
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error updating scenario");
          vm.isSaving = false;
        });
    },
  },
};
</script>

<style scoped>
.modal-buttons {
  position: fixed;
  top: 11px;
  right: 15px;
  z-index: 1000;
}
</style>
