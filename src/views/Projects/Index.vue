<template>
<div class="projects">

  <div class="page-header">
    <h1 class="page-title">Projects</h1>
    <div class="actions">
      <a-button @click="openCreateProjectModal"
                icon="plus" type="primary">Create Project
      </a-button>
    </div>
  </div>

  <projects-table></projects-table>

</div>
</template>

<script>
import ProjectsTable from "./Index/ProjectsTable";
export default {
name: "Index",
  components: {ProjectsTable},
  methods: {
    openCreateProjectModal() {
      alert('open')
    }
  }
}
</script>

<style scoped>

</style>