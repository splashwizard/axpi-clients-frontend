<template>
  <div class="projects">
    <loading-screen :is-loading="isLoading || isLoadingTeam || isDeleting || isLoadingRoles"></loading-screen>
    <a-layout>
      <left-sidebar :project="project"></left-sidebar>
      <a-layout style="padding: 7px 30px" :key="updateKey">
        <div class="page-header" v-if="project">
          <h1 class="page-title">
            {{ project.name }}
          </h1>
          <div class="actions">
            <add-team-member-button-and-modal
              :project-id="projectId"
              @reload="fetchTeam"
            ></add-team-member-button-and-modal>
          </div>
        </div>

        <div>
          <a-list class="project-list" :loading="isLoadingTeam" item-layout="horizontal" :data-source="team">
            <team-list-item
              @reload="fetchTeam"
              :roles="roles"
              :project-id="projectId"
              slot="renderItem"
              slot-scope="item"
              :item="item"
            ></team-list-item>
          </a-list>

          <!-- Footer actions -->
          <div class="footer-actions">
            <!--            <add-team-member-button-and-modal :project-id="projectId"-->
            <!--                                              @reload="fetchTeam"-->
            <!--            ></add-team-member-button-and-modal>-->
          </div>
          <!-- / Footer actions -->
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import LeftSidebar from "./LeftSidebar";
import Forms from "../../mixins/Forms";
import AddTeamMemberButtonAndModal from "./Team/AddTeamMemberButtonAndModal";
import Images from "../../mixins/Images";
import TeamListItem from "./Team/TeamListItem";

// const _ = require('lodash');

export default {
  name: "Team",
  components: { TeamListItem, AddTeamMemberButtonAndModal, LeftSidebar },
  mixins: [Forms, Images],
  created() {
    this.projectId = this.$route.params.id;
    this.loadProject(this.$route.params.id);
    this.fetchTeam();
    this.fetchRoles();
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
      team: [],
      isLoadingTeam: false,
      isDeleting: false,
      isLoadingRoles: false,
      roles: [],
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

    fetchTeam() {
      let vm = this;
      vm.isLoadingTeam = true;
      vm.serverErrors = [];
      axios
        .get(window.API_BASE + "/projects/" + this.projectId + "/team")
        .then((r) => {
          vm.isLoadingTeam = false;
          vm.team = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoadingTeam = false;
          vm.setErrors(e);
          vm.$message.error("Error loading team");
        });
    },

    fetchRoles() {
      let vm = this;
      vm.isLoadingRoles = true;
      axios
        .get(window.API_BASE + "/project-roles")
        .then((r) => {
          vm.roles = r.data;
          vm.isLoadingRoles = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoadingRoles = false;
          vm.roles = [];
          vm.$message.error("Error loading roles");
        });
    },
  },
};
</script>

<style scoped lang="scss">
.projects {
  height: 100%;
}

.page-header {
  padding-top: 15px;
  .actions {
    padding-top: 7px;
  }
}

.footer-actions {
  margin-top: 30px;
}

.project-list {
  margin-top: 30px;
}
</style>
