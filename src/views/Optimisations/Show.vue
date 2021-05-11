<template>
  <div class="optimisations">
    <loading-screen :is-loading="isLoading"></loading-screen>

    <div class="page-header" v-if="optimisation">
      <h1 class="page-title">{{ optimisation.name }}</h1>
      <a-button class="" type="primary" @click.prevent="runOptimisation">Optimise</a-button>
      <add-specification-to-optimisation-button-and-modal style="margin-left: 8px;"
          :optimisation="optimisation"
          @refresh-optimisation="refresh"
      ></add-specification-to-optimisation-button-and-modal>
    </div>

    <div v-if="optimisation">
      <optimisation-specifications-table :optimisation="optimisation"
                                         :reload-key="reloadOrdersKey"
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
    return {}
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
    })
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
      this.$router.push('/optimisations/' + this.optimisation.id + '/scenarios');
    },

    handleOptimisationSpecificationSelected(spec) {
      this.loadOptimisationSpecification(
          {
            optimisationId: spec.optimisation_id,
            id: spec.id
          }
      );
    }
  }
}
</script>

<style scoped>

</style>