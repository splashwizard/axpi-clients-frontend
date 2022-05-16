<template>
  <div class="home">
    <h1 class="page-title">Get started with Axiom</h1>
    <setup-progress-accordion></setup-progress-accordion>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SetupProgressAccordion from "../components/Home/SetupProgressAccordion";

export default {
  name: "Home",
  computed: {
    ...mapGetters("auth", {
      user: "user",
    }),
  },
  components: { SetupProgressAccordion },
  data() {
    return {
      activeSetupStep: 1,
    };
  },
};
</script>
