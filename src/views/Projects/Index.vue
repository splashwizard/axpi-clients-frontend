<template>
  <div class="projects">
    <div class="page-header">
      <h1 class="page-title">Projects</h1>
      <div class="actions">
        <create-project-button-and-modal></create-project-button-and-modal>
      </div>
    </div>

    <projects-table></projects-table>
  </div>
</template>

<script>
import ProjectsTable from "./Index/ProjectsTable";
import CreateProjectButtonAndModal from "./Index/CreateProjectButtonAndModal";

export default {
  name: "Index",
  components: { CreateProjectButtonAndModal, ProjectsTable },
};
</script>

<style scoped></style>
