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
      <optimisation-specifications-table :optimisation="optimisation"></optimisation-specifications-table>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import AddSpecificationToOptimisationButtonAndModal
  from "../../components/Optimisations/AddSpecificationToOptimisationButtonAndModal";
import OptimisationSpecificationsTable from "../../components/Optimisations/OptimisationSpecificationsTable";

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
  components: {AddSpecificationToOptimisationButtonAndModal, OptimisationSpecificationsTable},
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

    runOptimisation() {
      this.$router.push('/optimisations/' + this.optimisation.id + '/scenarios');
    }
  }
}
</script>

<style scoped>

</style>