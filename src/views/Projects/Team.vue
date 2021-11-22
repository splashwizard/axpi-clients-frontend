<template>
  <div class="projects">
    <loading-screen :is-loading="isLoading||isLoadingTeam||isDeleting"></loading-screen>
    <a-layout>
      <left-sidebar :project="project"></left-sidebar>
      <a-layout style="padding: 7px 30px" :key="updateKey">

        <div class="page-header" v-if="project">
          <h1 class="page-title">
            {{ project.name }}
          </h1>
          <div class="actions"></div>
        </div>

        <div>

          <a-list
              class="project-list"
              :loading="isLoadingTeam"
              item-layout="horizontal"
              :data-source="team"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a slot="actions" class="text-danger" @click.prevent="removeTeamMember(item)">Remove</a>
              <a-list-item-meta
                  :description="formatTeamMemberProjectRoles(item)"
              >
                <a slot="title" href="#">{{ item.user.name }}</a>
                <a-avatar
                    slot="avatar"
                    size="large"
                    :src="getAvatar(item.user)"
                />
              </a-list-item-meta>
            </a-list-item>
          </a-list>

          <!-- Footer actions -->
          <div class="footer-actions">
            <add-team-member-button-and-modal :project-id="projectId"
                                              @reload="fetchTeam"
            ></add-team-member-button-and-modal>
          </div>
          <!-- / Footer actions -->

        </div>

      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import axios from 'axios';
import {mapGetters, mapActions} from "vuex";
import LeftSidebar from "./LeftSidebar";
import Forms from "../../mixins/Forms";
import AddTeamMemberButtonAndModal from "./Team/AddTeamMemberButtonAndModal";
import Images from "../../mixins/Images";

const _ = require('lodash');

export default {
  name: "Team",
  components: {AddTeamMemberButtonAndModal, LeftSidebar},
  mixins: [Forms, Images],
  created() {
    this.projectId = this.$route.params.id;
    this.loadProject(this.$route.params.id);
    this.fetchTeam();
  },
  watch: {
    $route() {
      this.projectId = this.$route.params.id;
      this.loadProject(this.$route.params.id);
    }
  },
  data() {
    return {
      projectId: null,
      updateKey: 1,
      team: [],
      isLoadingTeam: false,
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('projectEditor', {
      isLoading: 'isLoading',
      project: 'project'
    })
  },
  methods: {
    refresh() {
      this.loadProject(this.$route.params.id);
    },

    ...mapActions('projectEditor', {
      loadProject: 'loadProject'
    }),

    backToAllProjects() {
      this.$router.push('/projects');
    },

    fetchTeam() {
      let vm = this;
      vm.isLoadingTeam = true;
      vm.serverErrors = [];
      axios.get(window.API_BASE + '/projects/' + this.projectId + '/team').then(r => {
        vm.isLoadingTeam = false;
        vm.team = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoadingTeam = false;
        vm.setErrors(e);
        vm.$message.error('Error loading team');
      });
    },

    removeTeamMember(teamMember) {
      let vm = this;
      vm.isDeleting = true;
      axios.delete(window.API_BASE + '/projects/' + this.projectId + '/team/' + teamMember.id).then(() => {
        vm.$message.success('Team member removed successfully');
        vm.isDeleting = false;
        vm.fetchTeam();
      }).catch(e => {
        console.log(e);
        vm.isDeleting = false;
        vm.$message.error('Error removing team member');
      });
    },

    formatTeamMemberProjectRoles(teamMember) {
      let roles = [];
      _.each(teamMember.project_roles, role => {
        roles.push(role.name);
      });
      if (roles.length) {
        return roles.join(', ');
      }
      return 'No roles assigned';
    }
  }
}
</script>

<style scoped>
.projects {
  height: 100%;
}

.footer-actions {
  margin-top: 30px;
}

.project-list {
  margin-top: 30px;
}
</style>