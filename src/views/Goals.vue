<template>
  <div class="goals">
    <div class="page-header">
      <h1 class="page-title">Goals</h1>
      <div class="actions">
        <router-link to="/goals/create">
          <a-button type="primary" icon="plus">Add Goal</a-button>
        </router-link>
      </div>
    </div>

    <goals-table></goals-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GoalsTable from "../components/Goals/GoalsTable";

export default {
  name: "Goals",
  computed: {
    ...mapGetters("auth", {
      user: "user",
    }),
  },
  components: { GoalsTable },
  data() {
    return {
      activeSetupStep: 1,
    };
  },
};
</script>
