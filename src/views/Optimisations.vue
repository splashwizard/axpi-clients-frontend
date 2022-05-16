<template>
  <div class="home">
    <div class="page-header">
      <h1 class="page-title">Optimisations</h1>
      <div class="actions">
        <create-optimisation-button-and-modal></create-optimisation-button-and-modal>
      </div>
    </div>

    <optimisations-table></optimisations-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import OptimisationsTable from "../components/Optimisations/OptimisationsTable";
import CreateOptimisationButtonAndModal from "../components/Optimisations/CreateOptimisationButtonAndModal";

export default {
  name: "Optimisations",
  computed: {
    ...mapGetters("auth", {
      user: "user",
    }),
  },
  components: { CreateOptimisationButtonAndModal, OptimisationsTable },
  data() {
    return {};
  },
};
</script>
