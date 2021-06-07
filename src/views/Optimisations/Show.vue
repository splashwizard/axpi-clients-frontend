<template>
  <div class="optimisations">
    <loading-screen :is-loading="isLoading||isOptimising"></loading-screen>

    <div class="page-header" v-if="optimisation">
      <h1 class="page-title">{{ optimisation.name }}</h1>
      <a-button icon="arrow-left" @click="backToAllOptimisations">Back to all optimisations</a-button>
      <div style="margin-left: 8px">
        <a-button :disabled="hasNoSpecs" class="" type="primary" @click.prevent="runOptimisation">Optimise</a-button>
      </div>
      <add-specification-to-optimisation-button-and-modal style="margin-left: 8px;"
                                                          :optimisation="optimisation"
                                                          @refresh-optimisation="refresh"
      ></add-specification-to-optimisation-button-and-modal>
    </div>

    <div v-if="optimisation">
      <optimisation-specifications-table :optimisation="optimisation"
                                         :reload-key="reloadOrdersKey"
                                         @set-number-of-specs="setNumberOfSpecs"
                                         @selected="handleOptimisationSpecificationSelected"></optimisation-specifications-table>

      <edit-order-modal v-if="order && type === 'optimisation-specification'"></edit-order-modal>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import AddSpecificationToOptimisationButtonAndModal
  from "../../components/Optimisations/AddSpecificationToOptimisationButtonAndModal";
import OptimisationSpecificationsTable from "../../components/Optimisations/OptimisationSpecificationsTable";
import EditOrderModal from "../../components/Orders/EditOrderModal";
import axios from 'axios';

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
      numberOfSpecs: null,
      isOptimising: false
    }
  },
  components: {EditOrderModal, AddSpecificationToOptimisationButtonAndModal, OptimisationSpecificationsTable},
  computed: {
    ...mapGetters('optimisationEditor', {
      isLoading: 'isLoading',
      optimisation: 'optimisation'
    }),

    ...mapGetters('orderEditor', {
      type: 'type',
      order: 'order',
      reloadOrdersKey: 'reloadOrdersKey'
    }),

    hasNoSpecs() {
      if (!this.numberOfSpecs) {
        return true;
      } else {
        return (this.numberOfSpecs == 0);
      }
    }
  },
  methods: {
    refresh() {
      this.loadOptimisation(this.$route.params.id);
    },

    ...mapActions('optimisationEditor', {
      loadOptimisation: 'loadOptimisation'
    }),

    ...mapActions('orderEditor', {
      loadOptimisationSpecification: 'loadOptimisationSpecification'
    }),

    runOptimisation() {
      let vm = this;
      vm.isOptimising = true;

      axios.post(window.API_BASE + '/optimisations/' + this.optimisation.id + '/optimise').then(() => {
        vm.isOptimising = false;
        this.$router.push('/optimisations/' + this.optimisation.id + '/scenarios');
      }).catch(e => {
        console.log(e);
        vm.isOptimising = false;
        this.$message.error('An error occurred while optimising');
      });
    },

    handleOptimisationSpecificationSelected(spec) {
      this.loadOptimisationSpecification(
          {
            optimisationId: spec.optimisation_id,
            id: spec.id
          }
      );
    },

    setNumberOfSpecs(numberOfSpecs) {
      this.numberOfSpecs = numberOfSpecs;
    },

    backToAllOptimisations() {
      this.$router.push('/optimisations');
    }
  }
}
</script>

<style scoped>

</style>