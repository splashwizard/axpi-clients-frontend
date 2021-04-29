<template>
  <a-modal v-model="visible"
           class="fullscreen-modal"
           :centered="true"
           title="Create Scenario"
           :footer="null">

    <!-- Loaded -->
    <div>
      <div class="axpi-form width-large">

      <optimisation-metrics :scenario="scenario"></optimisation-metrics>
        <constraints :scenario="scenario"></constraints>
      </div>
      <!-- / Selector -->

      <div class="modal-buttons">
        <a-button>Save</a-button>
      </div>
    </div>
    <!-- / Loaded -->

  </a-modal>
</template>
<script>
import OptimisationMetrics from "./Create/OptimisationMetrics";
import Constraints from "./Create/Constraints";

export default {
  name: "CreateScenarioModal",
  components: {OptimisationMetrics, Constraints},
  data() {
    return {
      visible: true,
      scenario: {
        optimisation_metric: 'best-price',
        custom_metrics: [
          {
            id: 'cost',
            label: 'Cost',
            value: 0
          }
        ],
        constraints: [

        ]
      }
    }
  }
}
</script>

<style scoped>
.modal-buttons {
  position: fixed;
  top: 11px;
  right: 15px;
  z-index: 1000;
}
</style>