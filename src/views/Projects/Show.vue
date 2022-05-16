<template>
  <div class="projects">
    <loading-screen :is-loading="isLoading"></loading-screen>
    <a-layout>
      <left-sidebar :project="project"></left-sidebar>
      <a-layout style="padding: 7px 30px" :key="updateKey">
        <div class="page-header" v-if="project">
          <h1 class="page-title">
            {{ project.name }}
          </h1>
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LeftSidebar from "./LeftSidebar";

export default {
  name: "Show",
  components: { LeftSidebar },
  created() {
    this.projectId = this.$route.params.id;
    this.loadProject(this.$route.params.id);
  },
  watch: {
    $route() {
      this.projectId = this.$route.params.id;
      this.loadProject(this.$route.params.id);
    },
  },
  data() {
    return {
      projectId: null,
      updateKey: 1,
    };
  },
  computed: {
    ...mapGetters("projectEditor", {
      isLoading: "isLoading",
      project: "project",
    }),
  },
  methods: {
    refresh() {
      this.loadProject(this.$route.params.id);
    },

    ...mapActions("projectEditor", {
      loadProject: "loadProject",
    }),

    backToAllProjects() {
      this.$router.push("/projects");
    },
  },
};
</script>

<style scoped>
.projects {
  height: 100%;
}
</style>
