<template>
  <div>
    <a-button icon="plus" type="primary" @click.prevent="showModal">Create Scenario</a-button>
    <a-modal v-model="visible" class="fullscreen-modal" :centered="true" title="Create Scenario" :footer="null">
      <loading-screen :is-loading="isSaving"></loading-screen>

      <!-- Loaded -->
      <div>
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
  name: "CreateScenarioModal",
  props: ["optimisationId"],
  components: { ScenarioDetails, OptimisationMetrics, Constraints, OtherDetails },
  data() {
    return {
      isSaving: false,
      visible: false,
      scenario: {
        optimisation_metric: "best-price",
        custom_metrics: [
          {
            id: "cost",
            label: "Cost",
            value: 0,
          },
        ],
        constraints: [],
        maximum_number_of_suppliers: 1,
        enable_search_beyond_existing_supplier_base: false,
        enable_bundling: false,
        name: "",
        description: "",
        tags: [],
      },
    };
  },
  methods: {
    showModal() {
      this.visible = true;
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
      this.visible = true;
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisationId + "/scenarios", this.getFormParams())
        .then(() => {
          vm.isSaving = false;
          vm.$message.success("Scenario added successfully!");
          vm.$emit("scenario-created");
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error saving scenario");
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
