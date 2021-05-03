<template>
  <div>
    <a-button icon="plus" type="primary" @click.prevent="showModal">Create Scenario</a-button>
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
          <other-details :scenario="scenario"></other-details>
          <scenario-details :scenario="scenario"></scenario-details>

          <!-- Form footer -->
          <div class="form-footer">
            <a-button size="large" type="primary" @click="saveAndQuit">
              Save And Quit
            </a-button>
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

export default {
  name: "CreateScenarioModal",
  components: {ScenarioDetails, OptimisationMetrics, Constraints, OtherDetails},
  data() {
    return {
      visible: false,
      scenario: {
        optimisation_metric: 'best-price',
        custom_metrics: [
          {
            id: 'cost',
            label: 'Cost',
            value: 0
          }
        ],
        constraints: [],
        maximum_number_of_suppliers: 1,
        enable_search_beyond_existing_supplier_base: false,
        enable_bundling: false,
        name: '',
        description: '',
        tags: []
      }
    }
  },
  methods: {
    showModal() {
      this.visible = true;
    },

    saveAndQuit() {
      this.visible = true;
      this.$message.success('Scenario added successfully!');
      this.$router.push('/optimisations/' + this.$route.params.id + '/scenarios?saved=true');
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