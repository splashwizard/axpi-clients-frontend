<template>
  <a-list-item>
    <div slot="actions" v-if="isEditing">
      <loading-screen :is-loading="isSaving"></loading-screen>
      <a-button type="primary" @click.prevent="save" style="margin-right: 10px">Save </a-button>
      <a-button type="danger" @click.prevent="cancelEditing">Cancel </a-button>
    </div>
    <a v-if="!isEditing" slot="actions" @click.prevent="edit">Edit</a>
    <a v-if="!isEditing" slot="actions" class="text-danger" @click.prevent="removeTeamMember(item)">Remove</a>
    <a-list-item-meta>
      <div slot="description">
        <div v-if="!isEditing">
          {{ formatTeamMemberProjectRoles(item) }}
        </div>
        <div v-if="isEditing">
          <a-checkbox-group v-model="projectRoleIds" :options="roleCheckboxOptions" />
        </div>
      </div>
      <a slot="title" href="#">{{ item.user.name }}</a>
      <a-avatar slot="avatar" size="large" :src="getAvatar(item.user)" />
    </a-list-item-meta>
  </a-list-item>
</template>

<script>
import Images from "../../../mixins/Images";
import axios from "axios";

const _ = require("lodash");

export default {
  name: "TeamListItem",
  props: ["item", "projectId", "roles"],
  mixins: [Images],
  data() {
    return {
      isEditing: false,
      projectRoleIds: [],
      isSaving: false,
    };
  },
  computed: {
    roleCheckboxOptions() {
      return _.map(this.roles, (role) => ({
        label: role.name,
        value: role.id,
      }));
    },
  },
  methods: {
    edit() {
      this.isEditing = true;
      this.projectRoleIds = _.map(this.item.project_roles, "id");
    },

    cancelEditing() {
      this.isEditing = false;
    },

    save() {
      let vm = this;
      vm.isSaving = true;
      axios
        .put(window.API_BASE + "/projects/" + this.projectId + "/team/" + this.item.id, {
          project_role_ids: this.projectRoleIds,
        })
        .then(() => {
          vm.$message.success("Team member updated successfully");
          vm.isEditing = false;
          vm.isSaving = false;
          vm.$emit("reload");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error updating team member");
        });
    },

    formatTeamMemberProjectRoles(teamMember) {
      let roles = [];
      _.each(teamMember.project_roles, (role) => {
        roles.push(role.name);
      });
      if (roles.length) {
        return roles.join(", ");
      }
      return "No roles assigned";
    },

    removeTeamMember(teamMember) {
      let vm = this;
      vm.isDeleting = true;
      axios
        .delete(window.API_BASE + "/projects/" + this.projectId + "/team/" + teamMember.id)
        .then(() => {
          vm.$message.success("Team member removed successfully");
          vm.isDeleting = false;
          // vm.fetchTeam();
          vm.$emit("reload");
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          vm.$message.error("Error removing team member");
        });
    },
  },
};
</script>

<style scoped></style>
