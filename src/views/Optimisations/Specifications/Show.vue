<template>
  <div class="specification-show">
    <loading-screen :is-loading="isLoading"></loading-screen>

    <a-layout>
      <left-sidebar :optimisation="optimisation"></left-sidebar>
      <a-layout style="padding: 7px 30px">
        <div class="page-header" v-if="specification">
          <h1 class="page-title">{{ specificationLocal.product_name }}</h1>
          <div class="actions" style="padding-top: 15px">
            <a-button type="primary" icon="arrow-left" @click="backToScenarios">Back to scenarios </a-button>
          </div>
        </div>

        <div class="page-body" v-if="specification">
          <order-description :order="specificationLocal"></order-description>
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import axios from "axios";
import orders from "../../../helpers/orders";
import OrderDescription from "../../../components/Orders/Show/OrderDescription";
import { mapActions, mapGetters } from "vuex";
import LeftSidebar from "../LeftSidebar";
const _ = require("lodash");

export default {
  name: "Show",
  created() {
    this.loadOptimisation(this.$route.params.optimisationId);
    this.loadSpecification(this.$route.params.optimisationId, this.$route.params.id);
  },
  watch: {
    $route() {
      this.loadOptimisation(this.$route.params.optimisationId);
      this.loadSpecification(this.$route.params.optimisationId, this.$route.params.id);
    },
  },
  data() {
    return {
      isLoading: false,
      specification: null,
      serverErrors: [],
    };
  },
  components: { OrderDescription, LeftSidebar },
  computed: {
    ...mapGetters("optimisationEditor", {
      isLoading: "isLoading",
      optimisation: "optimisation",
    }),

    specificationLocal() {
      return orders.decodeOrder(this.specification);
    },
  },
  methods: {
    backToOptimisation() {
      this.$router.push("/optimisations/" + this.$route.params.optimisationId);
    },

    backToScenarios() {
      this.$router.push("/optimisations/" + this.$route.params.optimisationId + "/scenarios");
    },

    goBack() {
      this.$router.back();
    },

    ...mapActions("optimisationEditor", {
      loadOptimisation: "loadOptimisation",
    }),

    loadSpecification(optimisationId, id) {
      let vm = this;
      vm.order = null;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/optimisations/" + optimisationId + "/specifications/" + id)
        .then((r) => {
          vm.isLoading = false;
          vm.specification = r.data;
        })
        .catch((e) => {
          vm.isLoading = false;
          vm.$message.error("Error loading specifications");
          console.log(e);

          let errors;
          if (e.response && e.response.data && typeof e.response.data === "object") {
            errors = _.flatten(_.toArray(e.response.data.errors));
          } else {
            errors = ["Something went wrong. Please try again."];
          }
          vm.serverErrors = errors;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.page-body {
  margin-top: 25px;
}

.specification-show {
  height: 100%;
}
</style>
